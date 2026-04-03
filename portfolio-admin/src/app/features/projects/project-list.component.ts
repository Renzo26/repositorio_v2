import {
  Component, inject, signal, OnInit,
  ChangeDetectionStrategy, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Project } from '../../core/models/portfolio.models';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Projetos</h1>
          <p class="text-sm text-gray-500 mt-1">{{ projetos().length }} projetos cadastrados</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/projetos/novo">
          <mat-icon class="mr-1">add</mat-icon>
          Novo Projeto
        </a>
      </div>

      <!-- Loading -->
      @if (carregando()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      <!-- Lista vazia -->
      @if (!carregando() && projetos().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-100">
          <mat-icon class="text-gray-300 text-6xl w-16 h-16">folder_open</mat-icon>
          <p class="mt-4 text-gray-500">Nenhum projeto cadastrado ainda.</p>
          <a mat-stroked-button routerLink="/projetos/novo" class="mt-4">
            Adicionar primeiro projeto
          </a>
        </div>
      }

      <!-- Grid de projetos -->
      @if (!carregando() && projetos().length > 0) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (projeto of projetos(); track projeto.id) {
            <div class="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <!-- Imagem ou placeholder -->
              @if (projeto.imageUrl) {
                <img
                  [src]="projeto.imageUrl"
                  [alt]="projeto.title"
                  class="w-full h-40 object-cover"
                />
              } @else {
                <div class="w-full h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <mat-icon class="text-indigo-300 text-4xl w-12 h-12">work</mat-icon>
                </div>
              }

              <div class="p-4">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-gray-900 text-sm line-clamp-1">{{ projeto.title }}</h3>
                  @if (projeto.featured) {
                    <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex-shrink-0">
                      Destaque
                    </span>
                  }
                </div>

                <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ projeto.description }}</p>

                <!-- Tecnologias -->
                @if (projeto.technologies.length > 0) {
                  <div class="flex flex-wrap gap-1 mt-3">
                    @for (tech of projeto.technologies.slice(0, 3); track tech) {
                      <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ tech }}</span>
                    }
                    @if (projeto.technologies.length > 3) {
                      <span class="text-xs text-gray-400">+{{ projeto.technologies.length - 3 }}</span>
                    }
                  </div>
                }

                <!-- Acoes -->
                <div class="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                  <a
                    mat-stroked-button
                    [routerLink]="['/projetos', projeto.id]"
                    class="flex-1 text-xs"
                  >
                    <mat-icon class="text-sm mr-1">edit</mat-icon>
                    Editar
                  </a>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="confirmarExclusao(projeto)"
                  >
                    <mat-icon class="text-sm">delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ProjectListComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  projetos = signal<Project[]>([]);
  carregando = signal(true);

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.carregando.set(true);
    this.api.getProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.projetos.set(data);
          this.carregando.set(false);
        },
        error: () => {
          this.snackBar.open('Erro ao carregar projetos', 'Fechar', { duration: 3000 });
          this.carregando.set(false);
        }
      });
  }

  confirmarExclusao(projeto: Project): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        titulo: 'Excluir projeto',
        mensagem: `Deseja excluir o projeto "${projeto.title}"? Esta acao nao pode ser desfeita.`,
        textoBotaoConfirmar: 'Excluir'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.api.deleteProject(projeto.id).subscribe({
          next: () => {
            this.projetos.update(lista => lista.filter(p => p.id !== projeto.id));
            this.snackBar.open('Projeto excluido com sucesso', 'Fechar', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Erro ao excluir projeto', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
