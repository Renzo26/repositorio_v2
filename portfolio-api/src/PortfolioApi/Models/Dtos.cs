using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Models;

// --- Projetos ---

public record ProjectDto(
    Guid Id,
    string Title,
    string Description,
    List<string> Technologies,
    string? ImageUrl,
    string? DemoUrl,
    string? RepoUrl,
    bool Featured,
    int Order,
    DateTime CreatedAt
);

public record CreateProjectDto(
    [Required][MaxLength(200)] string Title,
    [MaxLength(2000)] string Description,
    List<string> Technologies,
    string? ImageUrl,
    string? DemoUrl,
    string? RepoUrl,
    bool Featured,
    int Order
);

public record UpdateProjectDto(
    [Required][MaxLength(200)] string Title,
    [MaxLength(2000)] string Description,
    List<string> Technologies,
    string? ImageUrl,
    string? DemoUrl,
    string? RepoUrl,
    bool Featured,
    int Order
);

// --- Experiências ---

public record ExperienceDto(
    Guid Id,
    string Company,
    string Role,
    DateTime StartDate,
    DateTime? EndDate,
    string Description,
    string? ImageUrl,
    bool IsCurrent,
    DateTime CreatedAt
);

public record CreateExperienceDto(
    [Required][MaxLength(200)] string Company,
    [Required][MaxLength(200)] string Role,
    DateTime StartDate,
    DateTime? EndDate,
    [MaxLength(2000)] string Description,
    string? ImageUrl,
    bool IsCurrent
);

public record UpdateExperienceDto(
    [Required][MaxLength(200)] string Company,
    [Required][MaxLength(200)] string Role,
    DateTime StartDate,
    DateTime? EndDate,
    [MaxLength(2000)] string Description,
    string? ImageUrl,
    bool IsCurrent
);

// --- Certificados ---

public record CertificateDto(
    Guid Id,
    string Title,
    string Issuer,
    DateTime IssuedDate,
    DateTime? ExpiryDate,
    string? CredentialUrl,
    string? ImageUrl,
    string? Description,
    DateTime CreatedAt
);

public record CreateCertificateDto(
    [Required][MaxLength(200)] string Title,
    [Required][MaxLength(200)] string Issuer,
    DateTime IssuedDate,
    DateTime? ExpiryDate,
    string? CredentialUrl,
    string? ImageUrl,
    [MaxLength(1000)] string? Description
);

public record UpdateCertificateDto(
    [Required][MaxLength(200)] string Title,
    [Required][MaxLength(200)] string Issuer,
    DateTime IssuedDate,
    DateTime? ExpiryDate,
    string? CredentialUrl,
    string? ImageUrl,
    [MaxLength(1000)] string? Description
);

// --- Educação ---

public record EducationDto(
    Guid Id,
    string Institution,
    string Degree,
    string Field,
    DateTime StartDate,
    DateTime? EndDate,
    string? Description,
    string? ImageUrl,
    DateTime CreatedAt
);

public record CreateEducationDto(
    [Required][MaxLength(200)] string Institution,
    [Required][MaxLength(200)] string Degree,
    [MaxLength(200)] string Field,
    DateTime StartDate,
    DateTime? EndDate,
    [MaxLength(2000)] string? Description,
    string? ImageUrl
);

public record UpdateEducationDto(
    [Required][MaxLength(200)] string Institution,
    [Required][MaxLength(200)] string Degree,
    [MaxLength(200)] string Field,
    DateTime StartDate,
    DateTime? EndDate,
    [MaxLength(2000)] string? Description,
    string? ImageUrl
);

// --- Perfil ---

public record ProfileDto(
    Guid Id,
    string Name,
    string Title,
    string Bio,
    string? Email,
    string? Phone,
    string? Location,
    string? AvatarUrl,
    string? LinkedinUrl,
    string? GithubUrl,
    string? WebsiteUrl,
    string HeroGreeting,
    int HoursOfCode,
    int ProjectsDelivered,
    int SatisfactionRate,
    decimal AverageRating
);

public record UpdateProfileDto(
    [Required][MaxLength(200)] string Name,
    [MaxLength(200)] string Title,
    [MaxLength(2000)] string Bio,
    string? Email,
    string? Phone,
    string? Location,
    string? AvatarUrl,
    string? LinkedinUrl,
    string? GithubUrl,
    string? WebsiteUrl,
    [MaxLength(500)] string HeroGreeting,
    int HoursOfCode,
    int ProjectsDelivered,
    int SatisfactionRate,
    decimal AverageRating
);

// --- Auth ---

public record LoginRequest([Required] string Password);

public record LoginResponse(string Token, string Message);

// --- Upload ---

public record UploadResponse(string Url, string FileName);
