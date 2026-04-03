using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Endpoints;

public static class ProfileEndpoints
{
    public static void MapProfileEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/profile").WithTags("Perfil");

        // GET /api/profile — público
        group.MapGet("/", async (IProfileService service) =>
        {
            var profile = await service.GetAsync();
            return profile is null ? Results.NotFound() : Results.Ok(profile);
        })
        .WithSummary("Retorna o perfil público");

        // PUT /api/profile — protegido (cria ou atualiza)
        group.MapPut("/", async (UpdateProfileDto dto, IProfileService service) =>
        {
            var profile = await service.UpsertAsync(dto);
            return Results.Ok(profile);
        })
        .RequireAuthorization()
        .WithSummary("Cria ou atualiza o perfil");
    }
}
