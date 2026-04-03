import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Project, CreateProjectDto, UpdateProjectDto,
  Experience, CreateExperienceDto, UpdateExperienceDto,
  Certificate, CreateCertificateDto, UpdateCertificateDto,
  Education, CreateEducationDto, UpdateEducationDto,
  Profile, UpdateProfileDto,
  UploadResponse
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ─── Projetos ───────────────────────────────────────────────────────────────

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/api/projects`);
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.base}/api/projects/${id}`);
  }

  createProject(dto: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${this.base}/api/projects`, dto);
  }

  updateProject(id: string, dto: UpdateProjectDto): Observable<Project> {
    return this.http.put<Project>(`${this.base}/api/projects/${id}`, dto);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/projects/${id}`);
  }

  // ─── Experiências ───────────────────────────────────────────────────────────

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.base}/api/experiences`);
  }

  getExperience(id: string): Observable<Experience> {
    return this.http.get<Experience>(`${this.base}/api/experiences/${id}`);
  }

  createExperience(dto: CreateExperienceDto): Observable<Experience> {
    return this.http.post<Experience>(`${this.base}/api/experiences`, dto);
  }

  updateExperience(id: string, dto: UpdateExperienceDto): Observable<Experience> {
    return this.http.put<Experience>(`${this.base}/api/experiences/${id}`, dto);
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/experiences/${id}`);
  }

  // ─── Certificados ───────────────────────────────────────────────────────────

  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.base}/api/certificates`);
  }

  getCertificate(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.base}/api/certificates/${id}`);
  }

  createCertificate(dto: CreateCertificateDto): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.base}/api/certificates`, dto);
  }

  updateCertificate(id: string, dto: UpdateCertificateDto): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.base}/api/certificates/${id}`, dto);
  }

  deleteCertificate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/certificates/${id}`);
  }

  // ─── Educação ───────────────────────────────────────────────────────────────

  getEducations(): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.base}/api/education`);
  }

  getEducation(id: string): Observable<Education> {
    return this.http.get<Education>(`${this.base}/api/education/${id}`);
  }

  createEducation(dto: CreateEducationDto): Observable<Education> {
    return this.http.post<Education>(`${this.base}/api/education`, dto);
  }

  updateEducation(id: string, dto: UpdateEducationDto): Observable<Education> {
    return this.http.put<Education>(`${this.base}/api/education/${id}`, dto);
  }

  deleteEducation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/education/${id}`);
  }

  // ─── Perfil ─────────────────────────────────────────────────────────────────

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.base}/api/profile`);
  }

  updateProfile(dto: UpdateProfileDto): Observable<Profile> {
    return this.http.put<Profile>(`${this.base}/api/profile`, dto);
  }

  // ─── Upload ─────────────────────────────────────────────────────────────────

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.base}/api/upload`, formData);
  }
}
