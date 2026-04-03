import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'projetos',
        pathMatch: 'full'
      },
      {
        path: 'projetos',
        loadComponent: () =>
          import('./features/projects/project-list.component').then(m => m.ProjectListComponent)
      },
      {
        path: 'projetos/novo',
        loadComponent: () =>
          import('./features/projects/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'projetos/:id',
        loadComponent: () =>
          import('./features/projects/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'experiencias',
        loadComponent: () =>
          import('./features/experiences/experience-list.component').then(m => m.ExperienceListComponent)
      },
      {
        path: 'experiencias/nova',
        loadComponent: () =>
          import('./features/experiences/experience-form.component').then(m => m.ExperienceFormComponent)
      },
      {
        path: 'experiencias/:id',
        loadComponent: () =>
          import('./features/experiences/experience-form.component').then(m => m.ExperienceFormComponent)
      },
      {
        path: 'certificados',
        loadComponent: () =>
          import('./features/certificates/certificate-list.component').then(m => m.CertificateListComponent)
      },
      {
        path: 'certificados/novo',
        loadComponent: () =>
          import('./features/certificates/certificate-form.component').then(m => m.CertificateFormComponent)
      },
      {
        path: 'certificados/:id',
        loadComponent: () =>
          import('./features/certificates/certificate-form.component').then(m => m.CertificateFormComponent)
      },
      {
        path: 'educacao',
        loadComponent: () =>
          import('./features/education/education-list.component').then(m => m.EducationListComponent)
      },
      {
        path: 'educacao/nova',
        loadComponent: () =>
          import('./features/education/education-form.component').then(m => m.EducationFormComponent)
      },
      {
        path: 'educacao/:id',
        loadComponent: () =>
          import('./features/education/education-form.component').then(m => m.EducationFormComponent)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/profile/profile-form.component').then(m => m.ProfileFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
