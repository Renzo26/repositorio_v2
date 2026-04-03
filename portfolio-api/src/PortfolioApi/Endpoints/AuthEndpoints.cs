using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PortfolioApi.Models;

namespace PortfolioApi.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        app.MapPost("/api/auth/login", (LoginRequest request, IConfiguration config) =>
        {
            var adminPassword = config["AdminPassword"]
                ?? throw new InvalidOperationException("AdminPassword não configurado");

            if (request.Password != adminPassword)
            {
                return Results.Unauthorized();
            }

            var token = GerarToken(config);
            return Results.Ok(new LoginResponse(token, "Login realizado com sucesso"));
        })
        .AllowAnonymous()
        .WithTags("Autenticação")
        .WithSummary("Autentica com senha de admin e retorna JWT");
    }

    private static string GerarToken(IConfiguration config)
    {
        var jwtKey = config["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key não configurado");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(JwtRegisteredClaimNames.Sub, "portfolio-admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var expiraEm = int.Parse(config["Jwt:ExpiresInHours"] ?? "24");

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiraEm),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
