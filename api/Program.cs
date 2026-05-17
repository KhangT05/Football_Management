using DoAnTotNghiep.API.Common.Route;
using DoAnTotNghiep.API.Data;
using DoAnTotNghiep.API.Data.Seeders;
using DoAnTotNghiep.API.Middleware;
using DoAnTotNghiep.API.Repositories.Implements;
using DoAnTotNghiep.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

[assembly: ApiController]
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register services
// builder.Services.AddScoped<ITokenService, TokenService>();
// builder.Services.AddScoped<IAuthService, AuthService>();
// builder.Services.AddScoped<IPermissionService, PermissionService>();

// // JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];
// if (string.IsNullOrEmpty(jwtSecret))
// {
//     throw new InvalidOperationException("Jwt:Secret not configured in appsettings");
// }

var key = Encoding.UTF8.GetBytes(jwtSecret);
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = "Bearer";
        options.DefaultChallengeScheme = "Bearer";
    })
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Add CSRF protection
// Configure CSRF (Anti-Forgery) protection
builder.Services.AddAntiforgery(options =>
{
    // Cookie storing the CSRF token
    options.Cookie.Name = "XSRF-TOKEN";

    // Allow frontend JS (SPA) to read token from cookie
    options.Cookie.HttpOnly = false;

    // Send cookie only over HTTPS
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

    // Protect against cross-site requests
    options.Cookie.SameSite = SameSiteMode.Lax;

    // Header used by frontend to send CSRF token
    options.HeaderName = "X-XSRF-TOKEN";
});

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.SetIsOriginAllowed(origin =>

        {
            var uri = new Uri(origin);

            return uri.Host == "localhost";
        })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
builder.Services.AddControllers(opt => opt.Conventions.Add(new ApiRouteConvention("api/v1")));

var app = builder.Build();
await DataSeeder.SeedAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

app.MapControllers();
app.Run();