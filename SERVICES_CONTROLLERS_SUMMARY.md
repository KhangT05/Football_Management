# Services & Controllers Implementation Summary

## Completed Modules

### 1. PlayerService / PlayerController ✅
**File**: `Services/PlayerService.cs`, `Controllers/PlayerController.cs`

**Features**:
- ✅ GetList: Filter theo teamId, tournamentId, search name/studentId, pagination
- ✅ GetById: Kèm PlayerCard (thẻ phạt)
- ✅ Create: BeforeSaveAsync check MSSV unique
- ✅ Update: Load từ DB trước, sửa field
- ✅ SoftDelete: IsDeleted = true
- ✅ AfterSaveAsync: Tạo PlayerCard mới cho tournament

**Repository**: IPlayerRepository (Implemented)
- FindByStudentIdAsync: Kiểm tra MSSV unique
- GetByTeamIdAsync: Lấy cầu thủ theo đội
- GetByTournamentIdAsync: Lấy cầu thủ theo giải
- SearchAsync: Tìm kiếm theo name/studentId
- GetPagedAsync: Pagination
- CountAsync: Đếm theo filter

---

### 2. TeamService / TeamController ✅
**File**: `Services/TeamService.cs`, `Controllers/TeamController.cs`

**Features**:
- ✅ GetList: Kèm số lượng player, điểm xếp hạng
- ✅ AddPlayer: Check slot còn không
- ✅ RemovePlayer: Soft delete player khỏi team
- ✅ Create/Update/Delete

**Repository**: ITeamRepository (Implemented)
- FindByNameAsync: Check tên đội unique
- GetByTournamentIdAsync: Lấy đội theo giải
- CountPlayersAsync: Đếm cầu thủ
- HasAvailableSlotsAsync: Check slot còn

---

### 3. MatchService / MatchController ✅
**File**: `Services/MatchService.cs`, `Controllers/MatchController.cs`

**Features**:
- ✅ GetSchedule: Filter theo tournament, stage, date
- ✅ EnterResult: [RequirePermission(EnterMatchResult)]
  - Tạo MatchEvent
  - AfterSaveAsync tính toán:
    * Update HomeScore / AwayScore
    * Nếu Yellow card lần 2 → IsSuspended = true
    * Nếu Red card → IsSuspended = true ngay
    * ExecuteUpdateAsync cho bulk update
- ✅ GetLive: Poll-friendly, AsNoTracking

**Repository**: IMatchRepository (Implemented)
- GetScheduleAsync: Filter theo tournament/stage/date
- GetLiveMatchesAsync: AsNoTracking
- GetMatchEventsAsync: Lấy events trận đấu

---

### 4. StandingService ✅
**File**: `Services/StandingService.cs`, `Controllers/StandingController.cs`

**Features**:
- ✅ GetByTournament: Map từ StandingView [Keyless]
- ✅ AsNoTracking, không cache live standings

**Repository**: IStandingRepository (Implemented)
- GetByTournamentIdAsync: Lấy bảng xếp hạng

---

### 5. TournamentService / TournamentController ✅
**File**: `Services/TournamentService.cs`, `Controllers/TournamentController.cs`

**Features**:
- ✅ Create: AdminPreset only
- ✅ GenerateSchedule: Tạo 28 trận group stage bằng AddRangeAsync
- ✅ AdvanceStage: Reset YellowCount bằng ExecuteUpdateAsync

**Repository**: ITournamentRepository (Implemented)
- FindByNameAsync: Check tên unique
- GetActiveAsync: Lấy giải đang hoạt động

---

## Service Architecture

### BaseService<TEntity> ✅
**File**: `Services/Implements/BaseService.cs`

```csharp
// Lifecycle methods
protected virtual Task BeforeSaveAsync(TEntity entity)  // Validate business rules
protected virtual Task AfterSaveAsync(TEntity entity)   // Handle side effects

// Transaction support
protected async Task InTransactionAsync(Func<Task> action)  // Execute in transaction

// Database persistence
protected async Task SaveChangesAsync()  // Save once at the end
```

**Pattern**:
1. BeforeSaveAsync → Validate business rules
2. Add/Update entity in repository
3. AfterSaveAsync → Create side effects (e.g., PlayerCard)
4. SaveChangesAsync → Save once (NOT during execution)

---

## DTOs Created

- ✅ PlayerDto, CreatePlayerDto, UpdatePlayerDto, PlayerCardDto
- ✅ TeamDto, CreateTeamDto, UpdateTeamDto
- ✅ MatchDto, CreateMatchDto, UpdateMatchDto, EnterResultDto, MatchEventDto
- ✅ TournamentDto, CreateTournamentDto, UpdateTournamentDto
- ✅ StandingDto

---

## Repositories Implemented

All repositories extend `IBaseRepository<TEntity>`:
- ✅ IPlayerRepository → PlayerRepository
- ✅ ITeamRepository → TeamRepository
- ✅ IMatchRepository → MatchRepository
- ✅ ITournamentRepository → TournamentRepository
- ✅ IStandingRepository → StandingRepository

---

## Controllers Registered

All controllers registered in `Program.cs`:
- ✅ PlayerController: `/api/player`
- ✅ TeamController: `/api/team`
- ✅ MatchController: `/api/match`
- ✅ TournamentController: `/api/tournament`
- ✅ StandingController: `/api/standing`

All endpoints use `[RequirePermission]` or `[RequireAnyPermission]` attributes.

---

## Permission System Integration

### EnterMatchResult Permission
```csharp
[RequirePermission(Permission.EnterMatchResult)]
public async Task<MatchDto> EnterResultAsync(EnterResultDto dto)
```

### Required Permissions for CRUD
- View: `Permission.ViewUsers`
- Create/Update/Delete: `Permission.ManageUsers`
- Team/Tournament/Match Management: `Permission.ManageTeams`

---

## Database Operations

### Transaction Support
```csharp
await InTransactionAsync(async () =>
{
    await _context.MatchEvents.AddRangeAsync(events);
    await AfterEnterResultAsync(match, events);
});
```

### Bulk Updates
```csharp
await _context.PlayerCards
    .Where(pc => pc.PlayerId == card.PlayerId)
    .ExecuteUpdateAsync(setters => setters
        .SetProperty(pc => pc.YellowCount, pc => pc.YellowCount + 1));
```

### AsNoTracking for Performance
```csharp
public async Task<List<Match>> GetLiveMatchesAsync()
{
    return await _context.Matches
        .AsNoTracking()
        .Where(m => m.Status == "Live")
        .ToListAsync();
}
```

---

## Key Design Patterns

1. **Service Inheritance**: All services extend `BaseService<T>`
2. **Repository Pattern**: All data access through repositories
3. **BeforeSaveAsync/AfterSaveAsync**: Lifecycle hooks
4. **Transaction Support**: InTransactionAsync wrapper
5. **Single SaveChanges**: SaveChangesAsync called only once at the end
6. **No Hardcoding**: All data from database
7. **Authorization**: [RequirePermission] attributes on all endpoints
8. **AsNoTracking**: Used for read-only queries (live standings, matches)

---

## Compilation Status

✅ No compilation errors
✅ All services registered in DI container
✅ All controllers mapped
✅ All repositories implemented