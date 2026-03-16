using System.Text;
using System.IO.Compression;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PhuongXa.API.PhanMemTrungGian;
using PhuongXa.API;
using PhuongXa.Application;
using PhuongXa.Application.Chung;
using PhuongXa.Infrastructure;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ThemUngDung();
builder.Services.ThemHaTang(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddEndpointsApiExplorer();

// Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/json" });
});
builder.Services.Configure<BrotliCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);

// Output Caching
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.NoCache());
    options.AddPolicy("Public-Short", builder => builder.Expire(TimeSpan.FromMinutes(2)).Tag("public"));
    options.AddPolicy("Public-Medium", builder => builder.Expire(TimeSpan.FromMinutes(10)).Tag("public"));
});

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
builder.Services.AddRateLimiter(options =>
{
    (string name, int limit, TimeSpan window)[] limiters =
    [
        ("login", 10, TimeSpan.FromMinutes(1)),
        ("register", 5, TimeSpan.FromHours(1)),
        ("contact", 5, TimeSpan.FromMinutes(5)),
        ("file-upload", 50, TimeSpan.FromHours(1)),
        ("search", 30, TimeSpan.FromMinutes(1)),
        ("application-track", 10, TimeSpan.FromMinutes(1)),
        ("submit-application", 10, TimeSpan.FromHours(1)),
    ];

    foreach (var (name, limit, window) in limiters)
    {
        options.AddFixedWindowLimiter(name, opt =>
        {
            opt.PermitLimit = limit;
            opt.Window = window;
            opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            opt.QueueLimit = 0;
        });
    }

    options.RejectionStatusCode = 429;
    options.OnRejected = async (ctx, _) =>
    {
        ctx.HttpContext.Response.ContentType = "application/json";
        await ctx.HttpContext.Response.WriteAsJsonAsync(
            PhanHoiApi.ThatBai("Quá nhiều yêu cầu. Vui lòng thử lại sau."));
    };
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PhuongXa API", Version = "v1", Description = "API quản lý phường xã" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization", Type = SecuritySchemeType.ApiKey, Scheme = "Bearer",
        BearerFormat = "JWT", In = ParameterLocation.Header, Description = "Nhập Bearer {token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, Array.Empty<string>() }
    });
});

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
    throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Jwt:Key");
if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException("Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256");
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true, ValidIssuer = jwtIssuer,
        ValidateAudience = true, ValidAudience = jwtAudience,
        ValidateLifetime = true, ClockSkew = TimeSpan.Zero
    };
});

var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]
    ?? throw new InvalidOperationException("Thiếu cấu hình bắt buộc: Cors:AllowedOrigins");

builder.Services.AddCors(opt =>
    opt.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
        .WithHeaders("Content-Type", "Authorization")
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
    catch (InvalidOperationException ex) when (ex.Message.Contains("người dùng hiện tại"))
    {
        context.Response.StatusCode = 401;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(PhanHoiApi.ThatBai("Không xác thực"));
    }
});
app.UseResponseCompression();

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

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("FrontendPolicy");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseOutputCache();
app.MapControllers();

using (var scope = app.Services.CreateScope())
    await BoGiongDuLieu.KhoiTaoDuLieuAsync(scope.ServiceProvider);

app.Run();
