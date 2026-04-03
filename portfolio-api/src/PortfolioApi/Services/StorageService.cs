namespace PortfolioApi.Services;

public interface IStorageService
{
    Task<string> UploadAsync(IFormFile file, string bucket = "portfolio");
}

public class SupabaseStorageService(IConfiguration config, ILogger<SupabaseStorageService> logger) : IStorageService
{
    private readonly string _supabaseUrl = config["Supabase:Url"] ?? throw new InvalidOperationException("Supabase:Url não configurado");
    private readonly string _supabaseKey = config["Supabase:ServiceKey"] ?? throw new InvalidOperationException("Supabase:ServiceKey não configurado");

    public async Task<string> UploadAsync(IFormFile file, string bucket = "portfolio")
    {
        // Gera nome único para o arquivo
        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = $"uploads/{fileName}";

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_supabaseKey}");
        httpClient.DefaultRequestHeaders.Add("apikey", _supabaseKey);

        using var stream = file.OpenReadStream();
        using var content = new StreamContent(stream);
        content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

        var url = $"{_supabaseUrl}/storage/v1/object/{bucket}/{filePath}";
        logger.LogInformation("Fazendo upload para Supabase Storage: {Url}", url);

        var response = await httpClient.PostAsync(url, content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            logger.LogError("Erro no upload para Supabase: {Error}", error);
            throw new InvalidOperationException($"Falha no upload da imagem: {error}");
        }

        // Retorna URL pública
        var publicUrl = $"{_supabaseUrl}/storage/v1/object/public/{bucket}/{filePath}";
        return publicUrl;
    }
}
