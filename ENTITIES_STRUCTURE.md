# Entities Structure - Hệ Thống Quản Lí Giải Bóng Đá Sinh Viên

## Tóm tắt các Entities

### Entities về Người Dùng & Quyền

#### **User**
- Lưu thông tin người dùng (admin, trọng tài, quản lí, người hâm mộ)
- Properties: Username, Email, PhoneNumber, PasswordHash, FullName, Avatar, LastLogin
- Relationships: 1-Many với UserRole (soft delete)

#### **Role**
- Định nghĩa các vai trò trong hệ thống
- Properties: Name, Description
- Relationships: 1-Many với UserRole

#### **UserRole**
- Liên kết người dùng với vai trò (Many-to-Many)
- Properties: UserId, RoleId
- Relationships: FK đến User, Role

### Entities về Đội & Cầu Thủ

#### **Team**
- Thông tin đội bóng
- Properties: Name, CoachName, City, FoundedYear, Logo, Description
- Relationships: 1-Many với TeamPlayer, Match (home/away), PlayerStatistic

#### **Player**
- Thông tin cầu thủ
- Properties: StudentId, FullName, Email, PhoneNumber, DateOfBirth, Position, JerseyNumber, Height, Weight, Nationality
- Relationships: 1-Many với TeamPlayer, Goal, Card, PlayerStatistic

#### **TeamPlayer**
- Liên kết cầu thủ với đội (Many-to-Many)
- Properties: JoinDate, LeaveDate, JerseyNumber, Status, Role
- Relationships: FK đến Team, Player

### Entities về Giải Đấu & Mùa Giải

#### **Tournament**
- Thông tin giải đấu chính
- Properties: Name, Description, StartDate, EndDate, Location, Status, MaxTeams, Format
- Relationships: 1-Many với Season, Match (soft delete)

#### **Season**
- Mùa giải trong một giải đấu
- Properties: Year, StartDate, EndDate, Status, Name
- Relationships: FK đến Tournament, 1-Many với Match, PlayerStatistic

#### **Venue**
- Sân vận động
- Properties: Name, Address, City, Country, Capacity, SurfaceType, ContactInfo
- Relationships: 1-Many với Match (soft delete)

### Entities về Trận Đấu & Kết Quả

#### **Match**
- Thông tin trận đấu
- Properties: MatchDate, StartTime, Status, HomeScore, AwayScore, Referee, Duration
- Relationships: FK đến Tournament, Season, Team (home/away), Venue, 1-Many với Goal, Card, MatchResult (soft delete)

#### **MatchResult**
- Kết quả chi tiết của trận đấu
- Properties: Result, WinnerTeamId, Attendance, Notes
- Relationships: 1-1 với Match

#### **Goal**
- Bàn thắng trong trận đấu
- Properties: Minute, GoalType (Normal/OwnGoal/Penalty), AssistedBy
- Relationships: FK đến Match, Player (scorer), Team (scoring team)

#### **Card**
- Thẻ phạt (vàng/đỏ)
- Properties: CardType (Yellow/Red), Minute, Reason
- Relationships: FK đến Match, Player, Team

### Entities về Thống Kê

#### **PlayerStatistic**
- Thống kê cầu thủ trong một mùa giải
- Properties: MatchesPlayed, GoalsScored, Assists, YellowCards, RedCards, MinutesPlayed, PassAccuracy, TacklesWon, InterceptionsCount
- Relationships: FK đến Player, Team, Season

## Quan Hệ Giữa Các Entities

```
User (1) -----> (Many) UserRole <----- (1) Role
         (soft delete)

Team (1) ------> (Many) TeamPlayer <----- (1) Player
  |                                          |
  |                                    (1-Many) Goals
  |                                    (1-Many) Cards
  +-------> (1-Many) Match (home)          |
  |                      |          (1-Many) PlayerStatistic
  +-------> (1-Many) Match (away)         
                          |
                    (1-Many) Goals
                    (1-Many) Cards
                    (1-1) MatchResult

Tournament (1) -------> (Many) Season
    |                             |
    +---> (1-Many) Match <--------+
               |
          (1-1) Venue
          (1-1) MatchResult

PlayerStatistic links Player, Team, Season together
```

## Base Classes

- **BaseEntities**: Cơ sở cho tất cả entities (Id, IsActive, CreatedAt, UpdatedAt)
- **AuditableEntity**: Extends BaseEntities, thêm CreatedBy, UpdatedBy
- **ISoftDeletable**: Interface cho soft delete (IsDeleted, DeletedAt, DeletedBy)
