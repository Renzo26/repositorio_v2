import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <!-- Sidebar -->
      <mat-sidenav
        mode="side"
        [opened]="sidebarAberto()"
        class="w-64 bg-white border-r border-gray-100"
      >
        <!-- Logo -->
        <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <mat-icon class="text-white text-sm">web</mat-icon>
          </div>
          <span class="font-semibold text-gray-900 text-sm">Portfolio Admin</span>
        </div>

        <!-- Menu -->
        <nav class="py-4">
          @for (item of menuItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-indigo-50 text-indigo-600 font-medium"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              class="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
            >
              <mat-icon class="text-[18px] w-5 h-5">{{ item.icon }}</mat-icon>
              {{ item.label }}
            </a>
          }
        </nav>

        <!-- Logout -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            mat-stroked-button
            class="w-full text-gray-500"
            (click)="logout()"
          >
            <mat-icon class="mr-2">logout</mat-icon>
            Sair
          </button>
        </div>
      </mat-sidenav>

      <!-- Conteudo principal -->
      <mat-sidenav-content class="flex flex-col bg-gray-50">
        <!-- Topbar -->
        <mat-toolbar class="bg-white border-b border-gray-100 shadow-none !h-14 flex-shrink-0">
          <button mat-icon-button (click)="toggleSidebar()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="flex-1"></span>
          <span class="text-sm text-gray-500">Painel Administrativo</span>
        </mat-toolbar>

        <!-- Pagina atual -->
        <main class="flex-1 overflow-auto p-6">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class LayoutComponent {
  private auth = inject(AuthService);

  sidebarAberto = signal(true);

  menuItems: MenuItem[] = [
    { label: 'Projetos', icon: 'work', route: '/projetos' },
    { label: 'Experiencias', icon: 'business_center', route: '/experiencias' },
    { label: 'Certificados', icon: 'verified', route: '/certificados' },
    { label: 'Educacao', icon: 'school', route: '/educacao' },
    { label: 'Perfil', icon: 'person', route: '/perfil' }
  ];

  toggleSidebar(): void {
    this.sidebarAberto.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }
}
