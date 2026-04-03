using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface IProjectService
{
    Task<List<ProjectDto>> GetAllAsync();
    Task<ProjectDto?> GetByIdAsync(Guid id);
    Task<ProjectDto> CreateAsync(CreateProjectDto dto);
    Task<ProjectDto?> UpdateAsync(Guid id, UpdateProjectDto dto);
    Task<bool> DeleteAsync(Guid id);
}
