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


                                                    ┌─────────────────────────────────────────────────────────────┐
│                    NORMAL MATCH FLOW                        │
└─────────────────────────────────────────────────────────────┘

startMatch()
  └─ Match: scheduled → ongoing, period=first_half, score=0-0

transitionPeriod() × N
  └─ first_half → half_time → second_half → [extra_time_first → ...] → full_time

recordEvent() × N                          ← có thể gọi cả khi pending_official
  └─ INSERT matchEvent
  └─ [if ongoing] update Match.home/away_score (live)
  └─ [if pending_official] skip live update — confirmOfficial sẽ recompute

finalizeMatch()
  └─ [if knockout && draw] throw — validate sớm, không chờ confirmOfficial
  └─ Match: ongoing → pending_official
  └─ Persist referee input (resultType, penalty, half-time) vào Match

─── GRACE PERIOD 15p ───────────────────────────────────────────

[Cron mỗi 2p] handleGracePeriodTimeout()
  ├─ event-based match → confirmOfficial() per-match (có side-effect)
  └─ manual-based match → batch updateMany → needs_review

confirmOfficial()
  ├─ event path: _computeScoreFromEvents() — recount từ toàn bộ events
  ├─ manual path: dùng manual_home/away_score
  └─ → MatchResultService.confirmResult()

┌─────────────────────────────────────────────────────────────┐
│              MatchResultService.confirmResult()             │
└─────────────────────────────────────────────────────────────┘

_guardConfirm()
  ├─ status không phải finished/cancelled
  ├─ chưa có MatchResult (unique constraint ở DB làm safety net)
  └─ knockout: không draw ở full_time; penalty: phải có scores

_resolveWinner()
  ├─ full_time: winner = score cao hơn
  ├─ extra_time: dùng homeExtraTime (cumulative 90+ET)
  ├─ penalty: winner = penalty cao hơn, final score = ET score
  └─ forfeit/walkover: winner = score cao hơn

$transaction {
  INSERT MatchResult (official)
  UPDATE Match (status=finished, score=final, clear grace fields)
  _updatePlayerStatistics()
    ├─ single-pass events → delta map (goals/yellow/red)
    ├─ batch-fetch accumulated_yellow_cards
    └─ Promise.all upsert × N players
}

[ngoài TX]
├─ round_robin: recomputeGroupStandings(groupId)
│     └─ full scan matches → accumulate → sort (points → tiebreakers) → upsert standings
└─ knockout: _resolveKnockoutWinner() → advanceWinner()
      ├─ single-leg: dùng winner từ match này
      └─ two-leg: fetch leg1 result → aggregate → tính winner
         → KnockoutService.propagateWinner()
               ├─ update parentSlot với winner team
               ├─ [cả 2 slot filled] CREATE Match(es) cho round tiếp theo
               └─ setImmediate: scheduleMatchBatch()

┌─────────────────────────────────────────────────────────────┐
│                    ALTERNATIVE FLOWS                        │
└─────────────────────────────────────────────────────────────┘

MANUAL SCORE (không có referee app):
  startMatch() → submitManualScore()
    └─ guard: reject nếu đã có events
    └─ ongoing → pending_official (manual_home/away_score saved)
  [timeout] → needs_review (không auto-confirm)
  Admin: confirmOfficial() → dùng manual scores

FORFEIT / WALKOVER:
  forfeitMatch()
    └─ bỏ qua grace period hoàn toàn
    └─ → confirmResult() trực tiếp với score từ tournamentRule.forfeit_score

ABANDON:
  abandonMatch()
    └─ ongoing → abandoned
    └─ không tạo MatchResult — match "không có kết quả"

APPEAL / OVERTURN:
  fileAppeal() / fileProtest()
    └─ MatchResult.status: official → under_review / protested

  resolveAppeal()
    ├─ uphold: → official, ghi note
    └─ overturn (chỉ full_time):
          $transaction { UPDATE MatchResult + Match scores }
          [ngoài TX] recomputeStandings (round_robin)
          [knockout] warn + manual fix



          # Tournament Rule Import & Match Lifecycle

## Tournament Rule Import Flow

```text
PDF
  ↓
OCR / Text Extraction
  ↓
LLM #1 (Evidence Extraction Only)
  ↓
Evidence JSON
  ↓
Rule Engine (Deterministic, No LLM)
```

### Rule Engine Responsibilities

* Required field validation
* Strict type coercion
* Business invariant validation

  * `win_points > draw_points >= lose_points >= 0`
* Remove duplicated `tiebreaker_order`
* Normalize values
* Final Zod schema validation

### Outcome

#### Validation Failed

```text
throw error
↓
reject import
↓
NO database writes
```

#### Validation Passed

```text
Final JSON
↓
transaction
  ├─ deactivate current active rule
  └─ create new rule (is_active=true)
```

---

# Match Lifecycle

## Normal Match Flow

```text
startMatch()
```

* Match status:

  * `scheduled → ongoing`
* Period:

  * `first_half`
* Initial score:

  * `0 - 0`

---

### Period Progression

```text
transitionPeriod()
```

```text
first_half
  ↓
half_time
  ↓
second_half
  ↓
[extra_time_first]
  ↓
[extra_time_second]
  ↓
full_time
```

---

### Event Recording

```text
recordEvent()
```

Can be executed during:

* `ongoing`
* `pending_official`

#### Ongoing Match

```text
INSERT MatchEvent
↓
Update live Match score
```

#### Pending Official

```text
INSERT MatchEvent
↓
Skip score update
↓
confirmOfficial() will recompute score
```

---

### Finalization

```text
finalizeMatch()
```

Validation:

```text
if knockout && draw
  → reject
```

State transition:

```text
ongoing
  ↓
pending_official
```

Persist referee-provided information:

* Result type
* Penalty score
* Half-time score
* Match notes

---

# Grace Period

Duration:

```text
15 minutes
```

---

## Scheduled Processing

```text
Cron (every 2 minutes)
```

### Event-Based Matches

```text
confirmOfficial()
```

Executed per match.

---

### Manual Score Matches

```text
updateMany()
↓
needs_review
```

No automatic confirmation.

---

# Official Confirmation

```text
confirmOfficial()
```

### Event-Based Match

```text
_computeScoreFromEvents()
```

Recompute score from entire event history.

---

### Manual Match

```text
manual_home_score
manual_away_score
```

Used as official score source.

---

### Next Step

```text
MatchResultService.confirmResult()
```

---

# MatchResultService.confirmResult()

## Guard Phase

```text
_guardConfirm()
```

Checks:

* Match not already finished
* Match not cancelled
* MatchResult does not already exist
* Knockout match cannot end in draw at full-time
* Penalty result must include penalty scores

Database unique constraint acts as final protection.

---

## Winner Resolution

```text
_resolveWinner()
```

### Full Time

```text
winner = higher score
```

### Extra Time

Uses cumulative score after:

```text
90 minutes + extra time
```

### Penalty

```text
winner = higher penalty score
final score = extra-time score
```

### Forfeit / Walkover

```text
winner = higher awarded score
```

---

## Transaction

```text
transaction
```

### Create Official Result

```text
INSERT MatchResult
```

Status:

```text
official
```

---

### Finalize Match

```text
UPDATE Match
```

* Status → `finished`
* Final score persisted
* Grace-period fields cleared

---

### Update Player Statistics

Single-pass event processing:

```text
events
  ↓
delta map
```

Tracks:

* Goals
* Yellow cards
* Red cards

Process:

```text
batch fetch accumulated yellows
↓
upsert player statistics
```

---

# Post-Transaction Actions

## Round Robin

```text
recomputeGroupStandings(groupId)
```

### Standings Rebuild

```text
full scan matches
  ↓
accumulate stats
  ↓
apply points
  ↓
apply tiebreakers
  ↓
upsert standings
```

---

## Knockout

```text
_resolveKnockoutWinner()
```

### Single Leg

```text
winner = current match winner
```

---

### Two Legs

```text
fetch leg 1 result
↓
aggregate score
↓
resolve winner
```

---

### Propagation

```text
KnockoutService.propagateWinner()
```

Actions:

```text
update parent slot
↓
if both slots filled
  → create next-round match(es)
↓
scheduleMatchBatch()
```

---

# Alternative Flows

## Manual Score

Used when referee application is unavailable.

```text
startMatch()
  ↓
submitManualScore()
```

Validation:

```text
if events exist
  → reject
```

State transition:

```text
ongoing
  ↓
pending_official
```

Store:

* manual_home_score
* manual_away_score

---

### Grace Timeout

```text
pending_official
  ↓
needs_review
```

No automatic confirmation.

---

### Admin Confirmation

```text
confirmOfficial()
```

Uses manual scores.

---

# Forfeit / Walkover

```text
forfeitMatch()
```

Behavior:

```text
skip grace period
↓
confirmResult()
```

Score source:

```text
tournamentRule.forfeit_score
```

---

# Abandoned Match

```text
abandonMatch()
```

State transition:

```text
ongoing
  ↓
abandoned
```

Behavior:

```text
No MatchResult created
```

Match remains without official result.

---

# Appeals & Protests

## Filing

```text
fileAppeal()
fileProtest()
```

Result status:

```text
official
  ↓
under_review
```

or

```text
official
  ↓
protested
```

---

## Appeal Resolution

```text
resolveAppeal()
```

### Uphold

```text
under_review
  ↓
official
```

Add resolution note.

---

### Overturn

Supported only for:

```text
full_time results
```

Transaction:

```text
UPDATE MatchResult
UPDATE Match
```

---

### Post-Processing

#### Round Robin

```text
recomputeGroupStandings()
```

Rebuild standings using updated result.

---

#### Knockout

Automatic rollback is NOT guaranteed.

```text
warn operator
↓
manual bracket correction required
```

Reason:

Subsequent knockout rounds may already have been generated or played.

```
```
confirmResult() / propagateWinner()
        │
        │ queue.add('schedule-matches', { matchIds, ... })
        ▼
   Redis (BullMQ internal keys)
   bull:schedule-matches:waiting
   bull:schedule-matches:active
   bull:schedule-matches:completed
   bull:schedule-matches:failed
        │
        │ Worker poll (long-poll, không phải interval)
        ▼
   Worker process job
   scheduleMatchBatch(matchIds, ...)
        │
        ├─ success → job moved to completed
        └─ fail    → retry (backoff) → sau N lần → failed queue