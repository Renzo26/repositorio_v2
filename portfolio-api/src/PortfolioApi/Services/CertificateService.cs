using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface ICertificateService
{
    Task<List<CertificateDto>> GetAllAsync();
    Task<CertificateDto?> GetByIdAsync(Guid id);
    Task<CertificateDto> CreateAsync(CreateCertificateDto dto);
    Task<CertificateDto?> UpdateAsync(Guid id, UpdateCertificateDto dto);
    Task<bool> DeleteAsync(Guid id);
}

public class CertificateService(AppDbContext db) : ICertificateService
{
    public async Task<List<CertificateDto>> GetAllAsync()
    {
        var items = await db.Certificates
            .OrderByDescending(c => c.IssuedDate)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<CertificateDto?> GetByIdAsync(Guid id)
    {
        var item = await db.Certificates.FindAsync(id);
        return item is null ? null : MapToDto(item);
    }

    public async Task<CertificateDto> CreateAsync(CreateCertificateDto dto)
    {
        var item = new Certificate
        {
            Title = dto.Title,
            Issuer = dto.Issuer,
            IssuedDate = dto.IssuedDate,
            ExpiryDate = dto.ExpiryDate,
            CredentialUrl = dto.CredentialUrl,
            ImageUrl = dto.ImageUrl,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        db.Certificates.Add(item);
        await db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<CertificateDto?> UpdateAsync(Guid id, UpdateCertificateDto dto)
    {
        var item = await db.Certificates.FindAsync(id);
        if (item is null) return null;

        item.Title = dto.Title;
        item.Issuer = dto.Issuer;
        item.IssuedDate = dto.IssuedDate;
        item.ExpiryDate = dto.ExpiryDate;
        item.CredentialUrl = dto.CredentialUrl;
        item.ImageUrl = dto.ImageUrl;
        item.Description = dto.Description;

        await db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var item = await db.Certificates.FindAsync(id);
        if (item is null) return false;

        db.Certificates.Remove(item);
        await db.SaveChangesAsync();
        return true;
    }

    private static CertificateDto MapToDto(Certificate c) => new(
        c.Id, c.Title, c.Issuer, c.IssuedDate, c.ExpiryDate,
        c.CredentialUrl, c.ImageUrl, c.Description, c.CreatedAt
    );
}
