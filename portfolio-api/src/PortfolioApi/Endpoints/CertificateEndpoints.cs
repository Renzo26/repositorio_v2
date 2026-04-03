using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Endpoints;

public static class CertificateEndpoints
{
    public static void MapCertificateEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/certificates").WithTags("Certificados");

        group.MapGet("/", async (ICertificateService service) =>
            Results.Ok(await service.GetAllAsync()))
            .WithSummary("Lista todos os certificados");

        group.MapGet("/{id:guid}", async (Guid id, ICertificateService service) =>
        {
            var item = await service.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        })
        .WithSummary("Busca um certificado por ID");

        group.MapPost("/", async (CreateCertificateDto dto, ICertificateService service) =>
        {
            var item = await service.CreateAsync(dto);
            return Results.Created($"/api/certificates/{item.Id}", item);
        })
        .RequireAuthorization()
        .WithSummary("Cria um novo certificado");

        group.MapPut("/{id:guid}", async (Guid id, UpdateCertificateDto dto, ICertificateService service) =>
        {
            var item = await service.UpdateAsync(id, dto);
            return item is null ? Results.NotFound() : Results.Ok(item);
        })
        .RequireAuthorization()
        .WithSummary("Atualiza um certificado");

        group.MapDelete("/{id:guid}", async (Guid id, ICertificateService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .RequireAuthorization()
        .WithSummary("Remove um certificado");
    }
}
