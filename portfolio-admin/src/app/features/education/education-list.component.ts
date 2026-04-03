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
import { Education } from '../../core/models/portfolio.models';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-education-list',
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
          <h1 class="text-2xl font-bold text-gray-900">Educacao</h1>
          <p class="text-sm text-gray-500 mt-1">{{ educacoes().length }} formacoes cadastradas</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/educacao/nova">
          <mat-icon class="mr-1">add</mat-icon>
          Nova Formacao
        </a>
      </div>

      @if (carregando()) {
        <div class="flex justify-center py-12"><mat-spinner diameter="40"></mat-spinner></div>
      }

      @if (!carregando() && educacoes().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-100">
          <mat-icon class="text-gray-300 text-6xl w-16 h-16">school</mat-icon>
          <p class="mt-4 text-gray-500">Nenhuma formacao cadastrada ainda.</p>
          <a mat-stroked-button routerLink="/educacao/nova" class="mt-4">
            Adicionar primeira formacao
          </a>
        </div>
      }

      @if (!carregando()) {
        <div class="space-y-3">
          @for (edu of educacoes(); track edu.id) {
            <div class="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
              @if (edu.imageUrl) {
                <img [src]="edu.imageUrl" [alt]="edu.institution" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              } @else {
                <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <mat-icon class="text-blue-400">school</mat-icon>
                </div>
              }

              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900">{{ edu.degree }}</h3>
                <p class="text-sm text-blue-600">{{ edu.institution }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ edu.field }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ edu.startDate | date:'yyyy' }} —
                  {{ edu.endDate ? (edu.endDate | date:'yyyy') : 'Em andamento' }}
                </p>
              </div>

              <div class="flex gap-1 flex-shrink-0">
                <a mat-icon-button [routerLink]="['/educacao', edu.id]">
                  <mat-icon class="text-sm">edit</mat-icon>
                </a>
                <button mat-icon-button color="warn" (click)="confirmarExclusao(edu)">
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
export class EducationListComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  educacoes = signal<Education[]>([]);
  carregando = signal(true);

  ngOnInit(): void {
    this.api.getEducations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.educacoes.set(data);
          this.carregando.set(false);
        },
        error: () => {
          this.snackBar.open('Erro ao carregar formacoes', 'Fechar', { duration: 3000 });
          this.carregando.set(false);
        }
      });
  }

  confirmarExclusao(edu: Education): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        titulo: 'Excluir formacao',
        mensagem: `Deseja excluir "${edu.degree}" em ${edu.institution}?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.api.deleteEducation(edu.id).subscribe({
          next: () => {
            this.educacoes.update(lista => lista.filter(e => e.id !== edu.id));
            this.snackBar.open('Formacao excluida!', 'Fechar', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Erro ao excluir formacao', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
