using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Endpoints;

public static class ExperienceEndpoints
{
    public static void MapExperienceEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/experiences").WithTags("Experiências");

        group.MapGet("/", async (IExperienceService service) =>
            Results.Ok(await service.GetAllAsync()))
            .WithSummary("Lista todas as experiências");

        group.MapGet("/{id:guid}", async (Guid id, IExperienceService service) =>
        {
            var item = await service.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        })
        .WithSummary("Busca uma experiência por ID");

        group.MapPost("/", async (CreateExperienceDto dto, IExperienceService service) =>
        {
            var item = await service.CreateAsync(dto);
            return Results.Created($"/api/experiences/{item.Id}", item);
        })
        .RequireAuthorization()
        .WithSummary("Cria uma nova experiência");

        group.MapPut("/{id:guid}", async (Guid id, UpdateExperienceDto dto, IExperienceService service) =>
        {
            var item = await service.UpdateAsync(id, dto);
            return item is null ? Results.NotFound() : Results.Ok(item);
        })
        .RequireAuthorization()
        .WithSummary("Atualiza uma experiência");

        group.MapDelete("/{id:guid}", async (Guid id, IExperienceService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .RequireAuthorization()
        .WithSummary("Remove uma experiência");
    }
}
