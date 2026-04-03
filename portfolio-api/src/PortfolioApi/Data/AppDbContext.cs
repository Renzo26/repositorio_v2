using Microsoft.EntityFrameworkCore;
using PortfolioApi.Models;

namespace PortfolioApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<Certificate> Certificates => Set<Certificate>();
    public DbSet<Education> Educations => Set<Education>();
    public DbSet<Profile> Profiles => Set<Profile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Project — mapeia TechnologiesRaw para coluna "technologies_raw"
        modelBuilder.Entity<Project>(e =>
        {
            e.ToTable("projects");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Title).HasColumnName("title");
            e.Property(x => x.Description).HasColumnName("description");
            e.Property(x => x.TechnologiesRaw).HasColumnName("technologies_raw");
            e.Property(x => x.ImageUrl).HasColumnName("image_url");
            e.Property(x => x.DemoUrl).HasColumnName("demo_url");
            e.Property(x => x.RepoUrl).HasColumnName("repo_url");
            e.Property(x => x.Featured).HasColumnName("featured");
            e.Property(x => x.Order).HasColumnName("order");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Ignore(x => x.Technologies);
        });

        modelBuilder.Entity<Experience>(e =>
        {
            e.ToTable("experiences");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Company).HasColumnName("company");
            e.Property(x => x.Role).HasColumnName("role");
            e.Property(x => x.StartDate).HasColumnName("start_date");
            e.Property(x => x.EndDate).HasColumnName("end_date");
            e.Property(x => x.Description).HasColumnName("description");
            e.Property(x => x.ImageUrl).HasColumnName("image_url");
            e.Property(x => x.IsCurrent).HasColumnName("is_current");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Certificate>(e =>
        {
            e.ToTable("certificates");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Title).HasColumnName("title");
            e.Property(x => x.Issuer).HasColumnName("issuer");
            e.Property(x => x.IssuedDate).HasColumnName("issued_date");
            e.Property(x => x.ExpiryDate).HasColumnName("expiry_date");
            e.Property(x => x.CredentialUrl).HasColumnName("credential_url");
            e.Property(x => x.ImageUrl).HasColumnName("image_url");
            e.Property(x => x.Description).HasColumnName("description");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Education>(e =>
        {
            e.ToTable("educations");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Institution).HasColumnName("institution");
            e.Property(x => x.Degree).HasColumnName("degree");
            e.Property(x => x.Field).HasColumnName("field");
            e.Property(x => x.StartDate).HasColumnName("start_date");
            e.Property(x => x.EndDate).HasColumnName("end_date");
            e.Property(x => x.Description).HasColumnName("description");
            e.Property(x => x.ImageUrl).HasColumnName("image_url");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Profile>(e =>
        {
            e.ToTable("profiles");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Name).HasColumnName("name");
            e.Property(x => x.Title).HasColumnName("title");
            e.Property(x => x.Bio).HasColumnName("bio");
            e.Property(x => x.Email).HasColumnName("email");
            e.Property(x => x.Phone).HasColumnName("phone");
            e.Property(x => x.Location).HasColumnName("location");
            e.Property(x => x.AvatarUrl).HasColumnName("avatar_url");
            e.Property(x => x.LinkedinUrl).HasColumnName("linkedin_url");
            e.Property(x => x.GithubUrl).HasColumnName("github_url");
            e.Property(x => x.WebsiteUrl).HasColumnName("website_url");
        });
    }
}
