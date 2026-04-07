// ─── Entidades retornadas pela API ────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  imageUrl: string | null;
  isCurrent: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  description: string | null;
  createdAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  heroGreeting: string;
  hoursOfCode: number;
  projectsDelivered: number;
  satisfactionRate: number;
  averageRating: number;
}

export interface UploadResponse {
  url: string;
  fileName: string;
}

// ─── DTOs de criação/atualização ─────────────────────────────────────────────

export interface CreateProjectDto {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  order: number;
}

export type UpdateProjectDto = CreateProjectDto;

export interface CreateExperienceDto {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  imageUrl: string | null;
  isCurrent: boolean;
}

export type UpdateExperienceDto = CreateExperienceDto;

export interface CreateCertificateDto {
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  description: string | null;
}

export type UpdateCertificateDto = CreateCertificateDto;

export interface CreateEducationDto {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  imageUrl: string | null;
}

export type UpdateEducationDto = CreateEducationDto;

export interface UpdateProfileDto {
  name: string;
  title: string;
  bio: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  heroGreeting: string;
  hoursOfCode: number;
  projectsDelivered: number;
  satisfactionRate: number;
  averageRating: number;
}
