using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface IProfileService
{
    Task<ProfileDto?> GetAsync();
    Task<ProfileDto> UpsertAsync(UpdateProfileDto dto);
}

public class ProfileService(AppDbContext db) : IProfileService
{
    public async Task<ProfileDto?> GetAsync()
    {
        var profile = await db.Profiles.FirstOrDefaultAsync();
        return profile is null ? null : MapToDto(profile);
    }

    public async Task<ProfileDto> UpsertAsync(UpdateProfileDto dto)
    {
        var profile = await db.Profiles.FirstOrDefaultAsync();

        if (profile is null)
        {
            profile = new Profile();
            db.Profiles.Add(profile);
        }

        profile.Name = dto.Name;
        profile.Title = dto.Title;
        profile.Bio = dto.Bio;
        profile.Email = dto.Email;
        profile.Phone = dto.Phone;
        profile.Location = dto.Location;
        profile.AvatarUrl = dto.AvatarUrl;
        profile.LinkedinUrl = dto.LinkedinUrl;
        profile.GithubUrl = dto.GithubUrl;
        profile.WebsiteUrl = dto.WebsiteUrl;

        await db.SaveChangesAsync();
        return MapToDto(profile);
    }

    private static ProfileDto MapToDto(Profile p) => new(
        p.Id, p.Name, p.Title, p.Bio, p.Email, p.Phone,
        p.Location, p.AvatarUrl, p.LinkedinUrl, p.GithubUrl, p.WebsiteUrl
    );
}
