# Device Identity & Auth Sync — README

> Tài liệu này giải thích mục đích, kiến trúc, và yêu cầu kỹ thuật của hệ thống đồng bộ **Web ↔ App** thông qua `deviceId`, hỗ trợ 3 phương thức xác thực: **Username/Password**, **OAuth 2.0**, và **Passkey**.

---

## Tại sao cần làm điều này?

Khi user đăng nhập trên nhiều thiết bị hoặc nền tảng (web browser, mobile app), hệ thống cần:

- **Biết thiết bị nào đang truy cập** → để audit, revoke session, phát hiện bất thường
- **Đồng bộ trạng thái đăng nhập** → logout một nơi có thể lan sang nơi khác nếu cần
- **Gắn session với thiết bị cụ thể** → tăng bảo mật, giảm token theft risk

`deviceId` là định danh duy nhất cho mỗi thiết bị/browser. Nó **không thay thế** user identity, mà là metadata đi kèm với session.

---

## Tổng quan luồng hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│                                                             │
│   Web Browser                     Mobile App               │
│   ┌─────────────┐                 ┌─────────────┐          │
│   │  deviceId   │                 │  deviceId   │          │
│   │ (localStorage /               │ (SecureStore/          │
│   │  fingerprint)│                │  Keychain)  │          │
│   └──────┬──────┘                 └──────┬──────┘          │
│          │                               │                  │
└──────────┼───────────────────────────────┼──────────────────┘
           │                               │
           ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       API / Auth Layer                      │
│                                                             │
│   POST /auth/login   POST /auth/oauth/callback              │
│   POST /auth/passkey/authenticate                           │
│                                                             │
│   → Nhận deviceId từ request body / header                  │
│   → Tạo hoặc cập nhật bản ghi device                       │
│   → Gắn deviceId vào session/token                         │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Database                             │
│                                                             │
│   user_devices                                              │
│   ├── id                                                    │
│   ├── user_id                                               │
│   ├── device_id          ← unique per device               │
│   ├── device_name        ← "Chrome on MacOS", "iPhone 15"  │
│   ├── auth_method        ← password | oauth | passkey      │
│   ├── last_seen_at                                          │
│   └── is_trusted                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## DeviceId — Cách tạo và lưu

### Web

```typescript
// Tạo deviceId nếu chưa có, persist qua localStorage
function getOrCreateDeviceId(): string {
  const key = 'app_device_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID(); // built-in browser API
    localStorage.setItem(key, id);
  }
  return id;
}
```

> **Lưu ý:** `localStorage` bị xóa khi user clear browser data. Đây là trade-off chấp nhận được — khi đó system coi như thiết bị mới.
>
> Nếu cần persistent hơn: kết hợp với browser fingerprinting (User-Agent + screen + timezone) làm fallback, nhưng fingerprint **không dùng làm primary key** vì không ổn định.

### Mobile (React Native / Flutter)

```typescript
// React Native — dùng expo-secure-store hoặc react-native-keychain
import * as SecureStore from 'expo-secure-store';
import { randomUUID } from 'expo-crypto';

async function getOrCreateDeviceId(): Promise<string> {
  const key = 'app_device_id';
  let id = await SecureStore.getItemAsync(key);
  if (!id) {
    id = randomUUID();
    await SecureStore.setItemAsync(key, id);
  }
  return id;
}
```

> Mobile SecureStore persist qua app update. Chỉ bị xóa khi uninstall.

### Gửi deviceId trong request

Mọi auth request đều phải kèm `deviceId`:

```typescript
// Gửi qua header hoặc body — team thống nhất 1 cách
const headers = {
  'X-Device-Id': getOrCreateDeviceId(),
  'Content-Type': 'application/json',
};
```

---

## Phương thức 1: Username / Password

### Luồng

```
Client                          Server
  │                               │
  ├─ POST /auth/login ────────────►│
  │  { email, password, deviceId }│
  │                               ├─ Verify password (bcrypt)
  │                               ├─ Upsert user_devices record
  │                               ├─ Tạo access_token + refresh_token
  │◄──────────────────────────────┤
  │  { access_token, refresh_token}
```

### Request format

```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "...",
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_name": "Chrome on Windows"
}
```

### Server-side (ví dụ C# / Node.js)

```csharp
// C# — controller action
public async Task<IActionResult> Login([FromBody] LoginRequest req)
{
    var user = await _userService.VerifyCredentials(req.Email, req.Password);
    if (user == null) return Unauthorized();

    await _deviceService.UpsertDevice(user.Id, req.DeviceId, req.DeviceName, "password");

    var tokens = _tokenService.GenerateTokens(user.Id, req.DeviceId);
    return Ok(tokens);
}
```

```typescript
// Node.js / TypeScript
app.post('/auth/login', async (req, res) => {
  const { email, password, device_id, device_name } = req.body;

  const user = await verifyCredentials(email, password); // bcrypt.compare
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  await upsertDevice(user.id, device_id, device_name, 'password');

  const tokens = generateTokens(user.id, device_id);
  res.json(tokens);
});
```

---

## Phương thức 2: OAuth 2.0

Dùng cho "Đăng nhập bằng Google / Facebook / GitHub / ...".

### Luồng (Authorization Code + PKCE)

```
Client                    Your Server              OAuth Provider (Google...)
  │                           │                           │
  ├─ Tạo code_verifier ───────┤                           │
  ├─ Hash → code_challenge    │                           │
  │                           │                           │
  ├─────────────── Redirect user đến Google Auth URL ─────►│
  │  ?client_id=...           │                           │
  │  &code_challenge=...      │                           │
  │  &state=...               │                           │
  │                           │          User đăng nhập   │
  │◄──────────────────────────┼─── Redirect về callback ──┤
  │  ?code=AUTH_CODE          │    ?code=AUTH_CODE        │
  │  &state=...               │                           │
  │                           │                           │
  ├─ POST /auth/oauth/callback►│                           │
  │  { code, code_verifier,   │                           │
  │    device_id }            │                           │
  │                           ├─── Exchange code ─────────►│
  │                           │◄── access_token ──────────┤
  │                           ├─── Get user profile ───────►│
  │                           │◄── { email, name, ... } ──┤
  │                           ├─ Upsert user + device      │
  │◄──────────────────────────┤                           │
  │  { access_token,          │                           │
  │    refresh_token }        │                           │
```

### Request format (callback)

```json
POST /auth/oauth/callback
{
  "provider": "google",
  "code": "4/0AX4XfWh...",
  "code_verifier": "dBjftJeZ4CVP...",
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_name": "Safari on iPhone"
}
```

### Điểm cần chú ý

| Điểm | Lý do |
|------|-------|
| Luôn dùng PKCE | Ngăn authorization code interception attack |
| Verify `state` param round-trip | Chống CSRF |
| Không trust email từ OAuth blindly | Một số provider không verify email — check `email_verified: true` |
| `device_id` gửi qua `state` param hoặc session | Để associate sau khi callback |

---

## Phương thức 3: Passkey (WebAuthn)

Passkey dùng **public-key cryptography** — không có password, không phishing được.

### Khái niệm cơ bản

- **Registration**: Device tạo key pair. Public key lưu server. Private key **không rời thiết bị**.
- **Authentication**: Server gửi `challenge`. Device ký bằng private key. Server verify bằng public key.

### Luồng Registration (lần đầu setup passkey)

```
Client                          Server
  │                               │
  ├─ POST /auth/passkey/register/begin ──►│
  │  { user_id, device_id }       │
  │                               ├─ Tạo challenge (random, 32 bytes)
  │                               ├─ Lưu challenge vào cache (TTL 5 phút)
  │◄──────────────────────────────┤
  │  { challenge, rpId, user }    │
  │                               │
  ├─ navigator.credentials.create() (browser WebAuthn API)
  ├─ User xác nhận bằng Face ID / Touch ID / PIN
  │                               │
  ├─ POST /auth/passkey/register/complete ►│
  │  { attestation, device_id }   │
  │                               ├─ Verify attestation
  │                               ├─ Lưu public key vào DB
  │◄──────────────────────────────┤
  │  { success: true }            │
```

### Luồng Authentication

```
Client                          Server
  │                               │
  ├─ POST /auth/passkey/auth/begin ──────►│
  │  { device_id }                │
  │                               ├─ Tạo challenge mới
  │◄──────────────────────────────┤
  │  { challenge, allowCredentials}│
  │                               │
  ├─ navigator.credentials.get() (browser)
  ├─ User xác nhận bằng biometric
  │                               │
  ├─ POST /auth/passkey/auth/complete ───►│
  │  { assertion, device_id }     │
  │                               ├─ Verify signature bằng stored public key
  │                               ├─ Verify challenge khớp (single-use)
  │                               ├─ Upsert device record
  │◄──────────────────────────────┤
  │  { access_token, refresh_token}│
```

### Client-side (Web)

```typescript
// Registration
async function registerPasskey(challenge: string, userId: string) {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64ToBuffer(challenge),
      rp: { name: 'Your App', id: window.location.hostname },
      user: {
        id: stringToBuffer(userId),
        name: 'user@example.com',
        displayName: 'User Name',
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256
      authenticatorSelection: {
        residentKey: 'required',      // discoverable credential
        userVerification: 'required', // biometric/PIN bắt buộc
      },
    },
  });
  return credential;
}

// Authentication
async function authenticatePasskey(challenge: string) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: base64ToBuffer(challenge),
      userVerification: 'required',
    },
  });
  return assertion;
}
```

### Điểm cần chú ý

| Điểm | Lý do |
|------|-------|
| Challenge phải server-generated, random, single-use | Client tự generate → vô nghĩa về security |
| Verify `origin` và `rpId` server-side | Đảm bảo request từ đúng domain |
| `userVerification: required` | Bắt buộc biometric/PIN, không chỉ presence check |
| Cần fallback auth method | Không phải mọi device support WebAuthn |
| Credential backup state | Biết passkey có sync (iCloud/Google) hay device-bound |

---

## Database Schema

```sql
-- Bảng lưu thông tin thiết bị
CREATE TABLE user_devices (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id       BIGINT NOT NULL,
    device_id     VARCHAR(100) NOT NULL,        -- UUID từ client
    device_name   VARCHAR(200),                 -- "Chrome on MacOS"
    auth_method   ENUM('password','oauth','passkey') NOT NULL,
    platform      ENUM('web','ios','android'),
    last_seen_at  DATETIME NOT NULL DEFAULT NOW(),
    created_at    DATETIME NOT NULL DEFAULT NOW(),
    is_trusted    BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE KEY uq_user_device (user_id, device_id),
    INDEX idx_device_id (device_id)
);

-- Bảng lưu passkey credentials
CREATE TABLE passkey_credentials (
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id             BIGINT NOT NULL,
    device_id           VARCHAR(100) NOT NULL,
    credential_id       VARCHAR(500) NOT NULL UNIQUE,  -- từ WebAuthn
    public_key          TEXT NOT NULL,                 -- COSE format
    sign_count          BIGINT NOT NULL DEFAULT 0,     -- replay detection
    aaguid              VARCHAR(100),                  -- authenticator type
    is_backup_eligible  BOOLEAN DEFAULT FALSE,         -- có thể sync không
    created_at          DATETIME NOT NULL DEFAULT NOW(),
    INDEX idx_user_passkey (user_id)
);
```

---

## API Endpoints Tổng Hợp

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/auth/login` | Đăng nhập username/password |
| `POST` | `/auth/oauth/callback` | Xử lý OAuth callback |
| `GET`  | `/auth/oauth/providers` | Danh sách provider hỗ trợ |
| `POST` | `/auth/passkey/register/begin` | Bắt đầu đăng ký passkey |
| `POST` | `/auth/passkey/register/complete` | Hoàn tất đăng ký passkey |
| `POST` | `/auth/passkey/auth/begin` | Bắt đầu xác thực passkey |
| `POST` | `/auth/passkey/auth/complete` | Hoàn tất xác thực passkey |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/logout` | Logout (revoke token + device session) |
| `GET`  | `/users/me/devices` | Danh sách thiết bị của user |
| `DELETE` | `/users/me/devices/:deviceId` | Revoke thiết bị cụ thể |

---

## Những thứ KHÔNG làm

- **Không tự generate `deviceId` phía server** — phải từ client để persistent qua các session
- **Không dùng `deviceId` như authentication factor** — nó chỉ là metadata
- **Không lưu password dạng plain text** — bcrypt với cost factor ≥ 12
- **Không tin `state` / `nonce` do client gửi trong OAuth** — phải server generate và verify round-trip
- **Không skip challenge verification trong Passkey** — đây là core security mechanism
- **Không dùng `deviceId` làm primary key trong DB** — user có thể uninstall/clear và tạo ID mới

---

## Checklist trước khi merge

- [ ] `deviceId` được generate đúng cách trên từng platform
- [ ] `deviceId` được gửi kèm trong tất cả auth requests
- [ ] Passkey challenge là server-generated, lưu cache với TTL, single-use
- [ ] OAuth `state` param được verify round-trip
- [ ] `email_verified` được check với OAuth provider response
- [ ] `user_devices` được upsert (không insert duplicate) sau mỗi login thành công
- [ ] Access token chứa `device_id` claim
- [ ] Logout revoke cả token lẫn device session nếu required

---

## Tài liệu tham khảo

- [WebAuthn Spec — W3C](https://www.w3.org/TR/webauthn-2/)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [PKCE RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [SimpleWebAuthn — thư viện JS dùng cho server + client](https://simplewebauthn.dev/)
- [Passkeys.dev — hướng dẫn implement thực tế](https://passkeys.dev/)
