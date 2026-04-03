namespace PortfolioApi.Services;

public class LocalStorageService(
    IWebHostEnvironment env,
    IHttpContextAccessor httpContextAccessor,
    ILogger<LocalStorageService> logger) : IStorageService
{
    public async Task<string> UploadAsync(IFormFile file, string bucket = "portfolio")
    {
        var uploadsPath = Path.Combine(env.WebRootPath ?? env.ContentRootPath, "uploads");
        Directory.CreateDirectory(uploadsPath);

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        logger.LogInformation("Arquivo salvo localmente: {FilePath}", filePath);

        var request = httpContextAccessor.HttpContext?.Request;
        var baseUrl = request != null
            ? $"{request.Scheme}://{request.Host}"
            : "http://localhost:5000";

        return $"{baseUrl}/uploads/{fileName}";
    }
}
