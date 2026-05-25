using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Football_Management.API.Attributes;
using Football_Management.API.Common.Exceptions;
using Football_Management.API.Data;
using Football_Management.API.Models.DTOs;
using Football_Management.API.Models.Entities;
using Football_Management.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Football_Management.API.Services.Auth;

// AuthService — dùng mapper thay vì new User(...)
[Scoped]
public class AuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IConfiguration _config;
    private readonly AppDbContext _db;
    private readonly ILogger<AuthService> _logger;
    private readonly IMapper _mapper;

    private static readonly TimeSpan RefreshTtl = TimeSpan.FromDays(7);
    private const int AccessTokenMinutes = 15;

    public AuthService(
        IUserRepository userRepo,
        IConfiguration config,
        AppDbContext db,
        ILogger<AuthService> logger,
        IMapper mapper)
    {
        _userRepo = userRepo;
        _config = config;
        _db = db;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<AuthResponse> LoginAsync(AuthLoginRequest request, string? ipAddress)
    {
        var user = await _userRepo.FindByEmailAsync(request.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            throw new UnauthorizedException("Email hoặc mật khẩu không chính xác.");

        return await IssueTokensAsync(user, ipAddress);
    }

    public async Task<AuthResponse> RegisterAsync(AuthRegisterRequest request, string? ipAddress)
    {
        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            if (await _userRepo.ExistsByEmailAsync(request.Email))
                throw new ForbiddenException("Email đã được sử dụng.");

            var user = _mapper.Map<User>(request);

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            await _userRepo.AddAsync(user);
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return await IssueTokensAsync(user, ipAddress);
        }
        catch { await tx.RollbackAsync(); throw; }
    }

    public async Task<AuthResponse> RefreshAsync(string refreshToken, string csrfToken, string? ipAddress)
    {
        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            var stored = await _db.RefreshTokens
                .Include(t => t.User)
                    .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(t =>
                    t.Token == refreshToken &&
                    t.ExpiresAt > DateTime.UtcNow);

            if (stored is null)
                throw new UnauthorizedException("Refresh token không hợp lệ.");

            if (stored.WasUsed || stored.IsRevoked)
            {
                await _db.RefreshTokens
                    .Where(t => t.UserId == stored.UserId)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(t => t.IsRevoked, true));

                await tx.CommitAsync();

                _logger.LogWarning(
                    "Reuse detected UserId#{UserId} IP:{IP} Token:{Token}",
                    stored.UserId, ipAddress, refreshToken);

                throw new ForbiddenException("Phát hiện vấn đề bảo mật.");
            }

            var storedCsrf = await _db.CsrfTokens
                .FirstOrDefaultAsync(t =>
                    t.UserId == stored.UserId &&
                    t.Token == csrfToken);

            if (storedCsrf is null)
                throw new ForbiddenException("CSRF token không hợp lệ.");

            stored.WasUsed = true;
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return await IssueTokensAsync(stored.User, ipAddress);
        }
        catch { await tx.RollbackAsync(); throw; }
    }

    public async Task RevokeAsync(string refreshToken)
    {
        var stored = await _db.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (stored is null) return;

        stored.IsRevoked = true;
        await _db.SaveChangesAsync();
    }

    // ── Private ───────────────────────────────────────────────────

    private async Task<AuthResponse> IssueTokensAsync(User user, string? ipAddress)
    {
        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            var refreshToken = GenerateToken(64);

            _db.RefreshTokens.Add(new RefreshToken
            {
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.Add(RefreshTtl),
                IpAddress = ipAddress
            });

            await _db.CsrfTokens
                .Where(t => t.UserId == user.Id)
                .ExecuteDeleteAsync();

            var csrfToken = GenerateToken(32);
            _db.CsrfTokens.Add(new CsrfToken
            {
                UserId = user.Id,
                Token = csrfToken
            });

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return new AuthResponse
            {
                AccessToken = GenerateAccessToken(user),
                RefreshToken = refreshToken,
                CsrfToken = csrfToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(AccessTokenMinutes)
            };
        }
        catch { await tx.RollbackAsync(); throw; }
    }

    private string GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? ""),
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(AccessTokenMinutes),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateToken(int byteLength)
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(byteLength));
    }
    public async Task<UserDto> GetMeAsync(int userId)
    {
        var user = await _userRepo.FindOrFailAsync(userId);
        return _mapper.Map<UserDto>(user);
    }
}