using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Endpoints;

public static class UploadEndpoints
{
    private static readonly string[] TiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    private const long TamanhoMaximo = 5 * 1024 * 1024; // 5MB

    public static void MapUploadEndpoints(this WebApplication app)
    {
        app.MapPost("/api/upload", async (IFormFile file, IStorageService storage) =>
        {
            // Valida tipo do arquivo
            if (!TiposPermitidos.Contains(file.ContentType))
            {
                return Results.BadRequest(new { erro = "Tipo de arquivo não permitido. Use: JPEG, PNG, WebP ou GIF." });
            }

            // Valida tamanho
            if (file.Length > TamanhoMaximo)
            {
                return Results.BadRequest(new { erro = "Arquivo muito grande. Tamanho máximo: 5MB." });
            }

            var url = await storage.UploadAsync(file);
            var fileName = Path.GetFileName(new Uri(url).LocalPath);

            return Results.Ok(new UploadResponse(url, fileName));
        })
        .RequireAuthorization()
        .DisableAntiforgery()
        .WithTags("Upload")
        .WithSummary("Faz upload de uma imagem para o Supabase Storage")
        .Accepts<IFormFile>("multipart/form-data");
    }
}
