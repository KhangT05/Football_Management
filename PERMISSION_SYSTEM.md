# Permission System Documentation

## Tổng quan

Hệ thống phân quyền sử dụng bitwise operations để kiểm tra quyền của users một cách hiệu quả.

## Permission Enum

```csharp
[Flags]
public enum Permission
{
    None = 0,
    ViewUsers = 1 << 0,        // 1
    CreateUsers = 1 << 1,      // 2
    EditUsers = 1 << 2,        // 4
    DeleteUsers = 1 << 3,      // 8
    ManageUsers = 1 << 4,      // 16 (View + Create + Edit + Delete)
    ViewTeams = 1 << 5,        // 32
    CreateTeams = 1 << 6,      // 64
    EditTeams = 1 << 7,        // 128
    DeleteTeams = 1 << 8,      // 256
    ManageTeams = 1 << 9,      // 512 (View + Create + Edit + Delete)
    ViewMatches = 1 << 10,     // 1024
    CreateMatches = 1 << 11,   // 2048
    EditMatches = 1 << 12,     // 4096
    DeleteMatches = 1 << 13,   // 8192
    ManageMatches = 1 << 14,   // 16384 (View + Create + Edit + Delete)
    EditProfile = 1 << 15,     // 32768
    Admin = 1 << 16            // 65536 (All permissions)
}
```

## Cách sử dụng

### 1. Authorization Attributes

#### RequirePermission (AND check - cần TẤT CẢ quyền)
```csharp
[RequirePermission(Permission.ManageUsers)] // Cần ManageUsers
public IActionResult DeleteUser() { ... }

[RequirePermission(Permission.ViewUsers, Permission.EditUsers)] // Cần cả ViewUsers VÀ EditUsers
public IActionResult UpdateUser() { ... }
```

#### RequireAnyPermission (OR check - cần ÍT NHẤT 1 quyền)
```csharp
[RequireAnyPermission(Permission.ManageUsers, Permission.EditProfile)] // Cần ManageUsers HOẶC EditProfile
public IActionResult UpdateProfile() { ... }
```

### 2. PermissionService

```csharp
// Cấp quyền
await _permissionService.GrantPermissionAsync(userId, Permission.ManageUsers);

// Thu hồi quyền
await _permissionService.RevokePermissionAsync(userId, Permission.ManageUsers);

// Kiểm tra quyền
bool hasPermission = await _permissionService.HasPermissionAsync(userId, Permission.ManageUsers);
bool hasAnyPermission = await _permissionService.HasAnyPermissionAsync(userId, Permission.ManageUsers, Permission.EditProfile);

// Lấy danh sách quyền
List<Permission> permissions = await _permissionService.GetUserPermissionsAsync(userId);
```

### 3. Extension Methods

```csharp
long userPermissions = 16; // ManageUsers

// Kiểm tra có quyền cụ thể
bool hasView = userPermissions.HasPermission(Permission.ViewUsers);

// Kiểm tra có ít nhất 1 trong các quyền
bool hasAny = userPermissions.HasAnyPermission(Permission.ManageUsers, Permission.EditProfile);

// Cấp quyền
long newPermissions = userPermissions.GrantPermission(Permission.ViewTeams);

// Thu hồi quyền
long updatedPermissions = userPermissions.RevokePermission(Permission.ManageUsers);

// Lấy danh sách quyền
List<Permission> permissionList = userPermissions.GetPermissions();
```

## API Endpoints

### Permission Management
- `POST /api/permission/grant/{userId}` - Cấp quyền cho user
- `POST /api/permission/revoke/{userId}` - Thu hồi quyền của user
- `GET /api/permission/user/{userId}` - Lấy danh sách quyền của user
- `GET /api/permission/check/{userId}?permission=1` - Kiểm tra quyền cụ thể
- `GET /api/permission/check-any/{userId}?permissions=1&permissions=2` - Kiểm tra ít nhất 1 quyền

### User Management
- `GET /api/user/me` - Lấy thông tin user hiện tại (cần ViewUsers)
- `GET /api/user` - Lấy tất cả users (cần ManageUsers)
- `POST /api/user` - Tạo user mới (cần ManageUsers)
- `PUT /api/user/{id}` - Cập nhật user (cần ManageUsers hoặc EditProfile)
- `DELETE /api/user/{id}` - Xóa user (cần ManageUsers)

## Ví dụ thực tế

### Cấp quyền Admin cho user
```csharp
await _permissionService.GrantPermissionAsync(userId, Permission.Admin);
```

### Kiểm tra user có thể quản lý users không
```csharp
if (await _permissionService.HasPermissionAsync(userId, Permission.ManageUsers))
{
    // Cho phép quản lý users
}
```

### Sử dụng trong Controller
```csharp
[RequirePermission(Permission.ManageUsers)]
public async Task<IActionResult> DeleteUser(Guid userId)
{
    // Chỉ user có quyền ManageUsers mới có thể truy cập
}
```

## Lưu ý

1. **Bitwise Operations**: Hệ thống sử dụng bitwise AND/OR để kiểm tra quyền hiệu quả.
2. **JWT Claims**: Quyền được lưu trong JWT token dưới claim "permission" dạng long.
3. **Database**: Quyền được lưu trong cột `Permission` của bảng `Users` dạng `long`.
4. **Security**: Authorization được kiểm tra ở cả attribute level và service level.