using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Endpoints;

public static class EducationEndpoints
{
    public static void MapEducationEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/education").WithTags("Educação");

        group.MapGet("/", async (IEducationService service) =>
            Results.Ok(await service.GetAllAsync()))
            .WithSummary("Lista todas as formações");

        group.MapGet("/{id:guid}", async (Guid id, IEducationService service) =>
        {
            var item = await service.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        })
        .WithSummary("Busca uma formação por ID");

        group.MapPost("/", async (CreateEducationDto dto, IEducationService service) =>
        {
            var item = await service.CreateAsync(dto);
            return Results.Created($"/api/education/{item.Id}", item);
        })
        .RequireAuthorization()
        .WithSummary("Cria uma nova formação");

        group.MapPut("/{id:guid}", async (Guid id, UpdateEducationDto dto, IEducationService service) =>
        {
            var item = await service.UpdateAsync(id, dto);
            return item is null ? Results.NotFound() : Results.Ok(item);
        })
        .RequireAuthorization()
        .WithSummary("Atualiza uma formação");

        group.MapDelete("/{id:guid}", async (Guid id, IEducationService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .RequireAuthorization()
        .WithSummary("Remove uma formação");
    }
}
