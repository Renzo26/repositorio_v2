import {
  Component, inject, signal, OnInit,
  ChangeDetectionStrategy, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Experience } from '../../core/models/portfolio.models';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Experiencias</h1>
          <p class="text-sm text-gray-500 mt-1">{{ experiencias().length }} experiencias cadastradas</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/experiencias/nova">
          <mat-icon class="mr-1">add</mat-icon>
          Nova Experiencia
        </a>
      </div>

      @if (carregando()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!carregando() && experiencias().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-100">
          <mat-icon class="text-gray-300 text-6xl w-16 h-16">business_center</mat-icon>
          <p class="mt-4 text-gray-500">Nenhuma experiencia cadastrada ainda.</p>
          <a mat-stroked-button routerLink="/experiencias/nova" class="mt-4">
            Adicionar primeira experiencia
          </a>
        </div>
      }

      @if (!carregando()) {
        <div class="space-y-3">
          @for (exp of experiencias(); track exp.id) {
            <div class="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
              @if (exp.imageUrl) {
                <img [src]="exp.imageUrl" [alt]="exp.company" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              } @else {
                <div class="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <mat-icon class="text-indigo-400">business</mat-icon>
                </div>
              }

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ exp.role }}</h3>
                    <p class="text-sm text-indigo-600">{{ exp.company }}</p>
                  </div>
                  @if (exp.isCurrent) {
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                      Atual
                    </span>
                  }
                </div>
                <p class="text-xs text-gray-400 mt-1">
                  {{ exp.startDate | date:'MMM yyyy':'':' pt-BR' }} —
                  {{ exp.isCurrent ? 'Presente' : (exp.endDate | date:'MMM yyyy':'':'pt-BR') }}
                </p>
                @if (exp.description) {
                  <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ exp.description }}</p>
                }
              </div>

              <div class="flex gap-1 flex-shrink-0">
                <a mat-icon-button [routerLink]="['/experiencias', exp.id]">
                  <mat-icon class="text-sm">edit</mat-icon>
                </a>
                <button mat-icon-button color="warn" (click)="confirmarExclusao(exp)">
                  <mat-icon class="text-sm">delete</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ExperienceListComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  experiencias = signal<Experience[]>([]);
  carregando = signal(true);

  ngOnInit(): void {
    this.api.getExperiences()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.experiencias.set(data);
          this.carregando.set(false);
        },
        error: () => {
          this.snackBar.open('Erro ao carregar experiencias', 'Fechar', { duration: 3000 });
          this.carregando.set(false);
        }
      });
  }

  confirmarExclusao(exp: Experience): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        titulo: 'Excluir experiencia',
        mensagem: `Deseja excluir a experiencia em "${exp.company}"?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.api.deleteExperience(exp.id).subscribe({
          next: () => {
            this.experiencias.update(lista => lista.filter(e => e.id !== exp.id));
            this.snackBar.open('Experiencia excluida!', 'Fechar', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Erro ao excluir experiencia', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
