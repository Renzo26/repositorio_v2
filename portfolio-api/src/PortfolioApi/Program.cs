using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PortfolioApi.Data;
using PortfolioApi.Endpoints;
using PortfolioApi.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── Banco de dados ───────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ─── Serviços da aplicação ────────────────────────────────────────────────────
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IExperienceService, ExperienceService>();
builder.Services.AddScoped<ICertificateService, CertificateService>();
builder.Services.AddScoped<IEducationService, EducationService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddHttpContextAccessor();

var supabaseUrl = builder.Configuration["Supabase:Url"];
var supabaseKey = builder.Configuration["Supabase:ServiceKey"];
var useSupabase = !string.IsNullOrWhiteSpace(supabaseUrl) && !string.IsNullOrWhiteSpace(supabaseKey);

if (useSupabase)
    builder.Services.AddScoped<IStorageService, SupabaseStorageService>();
else
    builder.Services.AddScoped<IStorageService, LocalStorageService>();

// ─── JWT ──────────────────────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key não configurado. Verifique appsettings.json ou variáveis de ambiente.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ─── CORS ─────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(",") ?? [];
var defaultOrigins = new[]
{
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:4200",
    "https://localhost:5173",
    "https://localhost:8080",
    "https://localhost:4200"
};
var origins = allowedOrigins.Length > 0
    ? allowedOrigins.Concat(defaultOrigins).ToArray()
    : defaultOrigins;

builder.Services.AddCors(options =>
{
    options.AddPolicy("PortfolioPolicy", policy =>
    {
        policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ─── Swagger ──────────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Portfolio API",
        Version = "v1",
        Description = "API para gerenciar conteúdo do portfólio pessoal"
    });

    // Suporte a JWT no Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Informe o token JWT obtido em POST /api/auth/login"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ─── Middleware ───────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("PortfolioPolicy");

var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseAuthentication();
app.UseAuthorization();

// ─── Endpoints ────────────────────────────────────────────────────────────────
app.MapAuthEndpoints();
app.MapProjectEndpoints();
app.MapExperienceEndpoints();
app.MapCertificateEndpoints();
app.MapEducationEndpoints();
app.MapProfileEndpoints();
app.MapUploadEndpoints();

// Health check simples
app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }))
    .WithTags("Health")
    .AllowAnonymous();

// ─── Migração automática em desenvolvimento ───────────────────────────────────
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.Run();
