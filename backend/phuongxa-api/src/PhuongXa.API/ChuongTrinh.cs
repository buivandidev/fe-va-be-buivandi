using System.Text;
using System.IO.Compression;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PhuongXa.API.PhanMemTrungGian;
using PhuongXa.API.Controllers;
using PhuongXa.Application;
using PhuongXa.Application.Chung;
using PhuongXa.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ThemUngDung();
builder.Services.ThemHaTang(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddEndpointsApiExplorer();

// Standardize validation error response
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .SelectMany(e => e.Value!.Errors.Select(x => x.ErrorMessage))
            .ToList();
        return new BadRequestObjectResult(PhanHoiApi.ThatBai("Dữ liệu không hợp lệ", errors));
    };
});

// Rate limiting
                                                                                                                                                                                                                                                                                                                                              // builder.Services.AddRateLimiter(options =>
// {
//     (string name, int limit, TimeSpan window)[] limiters =
//     [
//         ("login", 10, TimeSpan.FromMinutes(1)),
//         ("register", 5, TimeSpan.FromHours(1)),
//         ("contact", 5, TimeSpan.FromMinutes(5)),
//         ("comment", 10, TimeSpan.FromMinutes(1)),
//         ("file-upload", 50, TimeSpan.FromHours(1)),
//         ("search", 30, TimeSpan.FromMinutes(1)),
//         ("application-track", 10, TimeSpan.FromMinutes(1)),
//         ("submit-application", 10, TimeSpan.FromHours(1)),
//     ];
// 
//     foreach (var (name, limit, window) in limiters)
//     {
//         options.AddFixedWindowLimiter(name, opt =>
//         {
//             opt.PermitLimit = limit;
//             opt.Window = window;
//             opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
//             opt.QueueLimit = 0;
//         });
//     }
// 
//     options.RejectionStatusCode = 429;
//     options.OnRejected = async (ctx, ct) =>
//     {
//         ctx.HttpContext.Response.ContentType = "application/json";
//         await ctx.HttpContext.Response.WriteAsJsonAsync(
//             PhanHoiApi.ThatBai("Quá nhiều yêu cầu. Vui lòng thử lại sau."), ct);
//     };
// });

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "PhuongXa API", 
        Version = "v1", 
        Description = "API quản lý phường xã" 
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization", 
        Type = SecuritySchemeType.ApiKey, 
        Scheme = "Bearer",
        BearerFormat = "JWT", 
        In = ParameterLocation.Header, 
        Description = "Nhập Bearer {token}"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
    throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Jwt:Key");

// Use UTF8 encoding for the key
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

// Ensure key is at least 32 bytes (256 bits) for HMAC-SHA256
if (keyBytes.Length < 32)
    throw new InvalidOperationException($"Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: {keyBytes.Length} bytes. Vui lòng sử dụng key dài hơn 32 ký tự.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Jwt:Issuer");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Jwt:Audience");

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = true, ValidIssuer = jwtIssuer,
        ValidateAudience = true, ValidAudience = jwtAudience,
        ValidateLifetime = true, ClockSkew = TimeSpan.Zero
    };

    opt.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrWhiteSpace(context.Token) &&
                context.Request.Cookies.TryGetValue("auth_token", out var token) &&
                !string.IsNullOrWhiteSpace(token))
            {
                context.Token = token;
            }

            return Task.CompletedTask;
        }
    };
});

var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]
    ?? throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Cors:AllowedOrigins");

builder.Services.AddCors(opt =>
    opt.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
        .AllowAnyHeader()
        .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .AllowCredentials()
        .WithExposedHeaders("Content-Disposition")));

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseMiddleware<PhanMemGhiNhanYeuCau>();
app.UseMiddleware<PhanMemNgoaiLeKichThuoc>();

// Global exception handler for unhandled exceptions
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (NguoiDungChuaXacThucException)
    {
        context.Response.StatusCode = 401;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(PhanHoiApi.ThatBai("Không xác thực"));
    }
});
// app.UseResponseCompression();

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "0";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";
    context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; frame-ancestors 'none'";
    await next();
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "PhuongXa API v1"));
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseStaticFiles();
app.UseCors("FrontendPolicy");
// app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
// app.UseOutputCache();
app.MapControllers();

using (var scope = app.Services.CreateScope())
    await PhuongXa.API.BoGiongDuLieu.KhoiTaoDuLieuAsync(scope.ServiceProvider);

app.Run();

