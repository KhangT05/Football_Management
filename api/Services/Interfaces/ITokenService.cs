using DoAnTotNghiep.API.Models.Entities;

namespace DoAnTotNghiep.API.Services.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    string GenerateCsrfToken();
}