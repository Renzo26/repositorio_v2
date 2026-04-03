using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface IExperienceService
{
    Task<List<ExperienceDto>> GetAllAsync();
    Task<ExperienceDto?> GetByIdAsync(Guid id);
    Task<ExperienceDto> CreateAsync(CreateExperienceDto dto);
    Task<ExperienceDto?> UpdateAsync(Guid id, UpdateExperienceDto dto);
    Task<bool> DeleteAsync(Guid id);
}

public class ExperienceService(AppDbContext db) : IExperienceService
{
    public async Task<List<ExperienceDto>> GetAllAsync()
    {
        var items = await db.Experiences
            .OrderByDescending(e => e.IsCurrent)
            .ThenByDescending(e => e.StartDate)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<ExperienceDto?> GetByIdAsync(Guid id)
    {
        var item = await db.Experiences.FindAsync(id);
        return item is null ? null : MapToDto(item);
    }

    public async Task<ExperienceDto> CreateAsync(CreateExperienceDto dto)
    {
        var item = new Experience
        {
            Company = dto.Company,
            Role = dto.Role,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            IsCurrent = dto.IsCurrent,
            CreatedAt = DateTime.UtcNow
        };

        db.Experiences.Add(item);
        await db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<ExperienceDto?> UpdateAsync(Guid id, UpdateExperienceDto dto)
    {
        var item = await db.Experiences.FindAsync(id);
        if (item is null) return null;

        item.Company = dto.Company;
        item.Role = dto.Role;
        item.StartDate = dto.StartDate;
        item.EndDate = dto.EndDate;
        item.Description = dto.Description;
        item.ImageUrl = dto.ImageUrl;
        item.IsCurrent = dto.IsCurrent;

        await db.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var item = await db.Experiences.FindAsync(id);
        if (item is null) return false;

        db.Experiences.Remove(item);
        await db.SaveChangesAsync();
        return true;
    }

    private static ExperienceDto MapToDto(Experience e) => new(
        e.Id, e.Company, e.Role, e.StartDate, e.EndDate,
        e.Description, e.ImageUrl, e.IsCurrent, e.CreatedAt
    );
}
