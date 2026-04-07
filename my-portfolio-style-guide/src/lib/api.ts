const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  heroGreeting?: string;
  hoursOfCode?: number;
  projectsDelivered?: number;
  satisfactionRate?: number;
  averageRating?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
}

export async function fetchProfile(): Promise<Profile> {
  const res = await fetch(`${API_URL}/api/profile`);
  if (!res.ok) throw new Error("Erro ao buscar perfil");
  return res.json();
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  imageUrl?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
  description?: string;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/api/projects`);
  if (!res.ok) throw new Error("Erro ao buscar projetos");
  return res.json();
}

export async function fetchEducation(): Promise<Education[]> {
  const res = await fetch(`${API_URL}/api/education`);
  if (!res.ok) throw new Error("Erro ao buscar formações");
  return res.json();
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const res = await fetch(`${API_URL}/api/certificates`);
  if (!res.ok) throw new Error("Erro ao buscar certificados");
  return res.json();
}
