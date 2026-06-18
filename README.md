# Monorepo — Vite + React / Express + TS

```
monorepo/
├── apps/
│   ├── api/          Express + TypeScript + Swagger
│   └── web/          Vite + React + TypeScript
├── nginx/            Nginx config mẫu cho VPS
├── .github/workflows/ci-cd.yml
├── docker-compose.yml   (dùng trên VPS)
├── vercel.json
└── netlify.toml
```

---

## Local dev

```bash
npm ci
# Terminal 1
npm run dev:api
# Terminal 2
npm run dev:web
```

- Web: http://localhost:5173
- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api-docs

Vite proxy `/api/*` → `localhost:3000` nên web gọi `/api/...` không cần CORS config lúc dev.

---

## GitHub Secrets cần thiết

| Secret | Mô tả |
|--------|-------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (không dùng password) |
| `VPS_HOST` | IP hoặc domain của VPS |
| `VPS_USER` | SSH user (thường là `ubuntu` hoặc `root`) |
| `VPS_SSH_KEY` | Private key SSH (nội dung file `~/.ssh/id_rsa`) |
| `VITE_API_BASE_URL` | URL API production, inject lúc build web |

---

## VPS setup (lần đầu)

```bash
# Trên VPS
mkdir -p /opt/app
cd /opt/app

# Copy docker-compose.yml và tạo .env từ .env.vps.example
cp .env.vps.example .env
# Chỉnh sửa .env với giá trị thực

# Pull image và start
docker compose up -d

# Nginx
sudo cp nginx/api.yourdomain.com.conf /etc/nginx/sites-available/api.yourdomain.com
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d api.yourdomain.com
```

---

## Web deploy

**Vercel:** Import repo → Framework Preset: Vite → Root Directory: `apps/web`  
Thêm env var `VITE_API_BASE_URL` trong Vercel dashboard.

**Netlify:** Import repo → `netlify.toml` tự handle build config.  
Thêm env var `VITE_API_BASE_URL` trong Netlify dashboard.

---

## CI/CD flow

```
push to main
  └─ CI: typecheck + build (cả api và web)
       └─ Docker: build image → push Docker Hub (tag = git SHA + latest)
            └─ Deploy: SSH vào VPS → docker compose up → health check
```

PR chỉ chạy CI, không deploy.

PDF → OCR/Text Extraction → LLM#1 (extract evidence, task hẹp) → Evidence JSON
                                                                       ↓
                                                              Rule Engine (deterministic, KHÔNG gọi LLM)
                                                              - required field check
                                                              - type coercion chặt
                                                              - business invariant (win > draw ≥ lose ≥ 0)
                                                              - dedupe tiebreaker_order
                                                              - Zod final shape validate
                                                                       ↓
                                                              throw → reject, KHÔNG tạo row nào
                                                              pass  → Final JSON → commit transaction
                                                                       ↓
                                                    [transaction] deactivate rule cũ + create rule mới (is_active=true)