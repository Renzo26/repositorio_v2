using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public class ProjectService(AppDbContext db) : IProjectService
{
    public async Task<List<ProjectDto>> GetAllAsync()
    {
        var projects = await db.Projects
            .OrderBy(p => p.Order)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();

        return projects.Select(MapToDto).ToList();
    }

    public async Task<ProjectDto?> GetByIdAsync(Guid id)
    {
        var project = await db.Projects.FindAsync(id);
        return project is null ? null : MapToDto(project);
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project
        {
            Title = dto.Title,
            Description = dto.Description,
            Technologies = dto.Technologies,
            ImageUrl = dto.ImageUrl,
            DemoUrl = dto.DemoUrl,
            RepoUrl = dto.RepoUrl,
            Featured = dto.Featured,
            Order = dto.Order,
            CreatedAt = DateTime.UtcNow
        };

        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return MapToDto(project);
    }

    public async Task<ProjectDto?> UpdateAsync(Guid id, UpdateProjectDto dto)
    {
        var project = await db.Projects.FindAsync(id);
        if (project is null) return null;

        project.Title = dto.Title;
        project.Description = dto.Description;
        project.Technologies = dto.Technologies;
        project.ImageUrl = dto.ImageUrl;
        project.DemoUrl = dto.DemoUrl;
        project.RepoUrl = dto.RepoUrl;
        project.Featured = dto.Featured;
        project.Order = dto.Order;

        await db.SaveChangesAsync();
        return MapToDto(project);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var project = await db.Projects.FindAsync(id);
        if (project is null) return false;

        db.Projects.Remove(project);
        await db.SaveChangesAsync();
        return true;
    }

    private static ProjectDto MapToDto(Project p) => new(
        p.Id, p.Title, p.Description, p.Technologies,
        p.ImageUrl, p.DemoUrl, p.RepoUrl, p.Featured, p.Order, p.CreatedAt
    );
}
