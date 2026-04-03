using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Endpoints;

public static class ProjectEndpoints
{
    public static void MapProjectEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/projects").WithTags("Projetos");

        // GET /api/projects — público, retorna todos os projetos ordenados
        group.MapGet("/", async (IProjectService service) =>
        {
            var projects = await service.GetAllAsync();
            return Results.Ok(projects);
        })
        .WithSummary("Lista todos os projetos");

        // GET /api/projects/{id}
        group.MapGet("/{id:guid}", async (Guid id, IProjectService service) =>
        {
            var project = await service.GetByIdAsync(id);
            return project is null ? Results.NotFound() : Results.Ok(project);
        })
        .WithSummary("Busca um projeto por ID");

        // POST /api/projects — protegido
        group.MapPost("/", async (CreateProjectDto dto, IProjectService service) =>
        {
            var project = await service.CreateAsync(dto);
            return Results.Created($"/api/projects/{project.Id}", project);
        })
        .RequireAuthorization()
        .WithSummary("Cria um novo projeto");

        // PUT /api/projects/{id} — protegido
        group.MapPut("/{id:guid}", async (Guid id, UpdateProjectDto dto, IProjectService service) =>
        {
            var project = await service.UpdateAsync(id, dto);
            return project is null ? Results.NotFound() : Results.Ok(project);
        })
        .RequireAuthorization()
        .WithSummary("Atualiza um projeto");

        // DELETE /api/projects/{id} — protegido
        group.MapDelete("/{id:guid}", async (Guid id, IProjectService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .RequireAuthorization()
        .WithSummary("Remove um projeto");
    }
}
