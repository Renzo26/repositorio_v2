using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface IEducationService
{
    Task<List<EducationDto>> GetAllAsync();
    Task<EducationDto?> GetByIdAsync(Guid id);
    Task<EducationDto> CreateAsync(CreateEducationDto dto);
    Task<EducationDto?> UpdateAsync(Guid id, UpdateEducationDto dto);
    Task<bool> DeleteAsync(Guid id);
}

public class EducationService(AppDbContext db) : IEducationService
{
    public async Task<List<EducationDto>> GetAllAsync()
    {
        var items = await db.Educations
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<EducationDto?> GetByIdAsync(Guid id)
    {
        var item = await db.Educations.FindAsync(id);
        return item is null ? null : MapToDto(item);
    }

    public async Task<EducationDto> CreateAsync(CreateEducationDto dto)
    {
        var item = new Education
        {
            Institution = dto.Institution,
            Degree = dto.Degree,
            Field = dto.Field,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        db.Educations.Add(item);
        await db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<EducationDto?> UpdateAsync(Guid id, UpdateEducationDto dto)
    {
        var item = await db.Educations.FindAsync(id);
        if (item is null) return null;

        item.Institution = dto.Institution;
        item.Degree = dto.Degree;
        item.Field = dto.Field;
        item.StartDate = dto.StartDate;
        item.EndDate = dto.EndDate;
        item.Description = dto.Description;
        item.ImageUrl = dto.ImageUrl;

        await db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var item = await db.Educations.FindAsync(id);
        if (item is null) return false;

        db.Educations.Remove(item);
        await db.SaveChangesAsync();
        return true;
    }

    private static EducationDto MapToDto(Education e) => new(
        e.Id, e.Institution, e.Degree, e.Field,
        e.StartDate, e.EndDate, e.Description, e.ImageUrl, e.CreatedAt
    );
}
