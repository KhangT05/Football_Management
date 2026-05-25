using Football_Management.API.Data;
using Football_Management.API.Data.Seeders;
using Football_Management.API.Extensions;
using Football_Management.API.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

[assembly: ApiController]
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddHttpContextAccessor();

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddMaps(typeof(Program).Assembly);
});

// DB
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];
// if (string.IsNullOrEmpty(jwtSecret))
// {
//     throw new InvalidOperationException("Jwt:Secret not configured in appsettings");
// }
// auto scan and use di
builder.Services.AddApplicationServices(typeof(Program).Assembly);

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
var app = builder.Build();
await DataSeeder.SeedAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();