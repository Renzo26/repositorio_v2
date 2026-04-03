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
import { Certificate } from '../../core/models/portfolio.models';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-certificate-list',
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
          <h1 class="text-2xl font-bold text-gray-900">Certificados</h1>
          <p class="text-sm text-gray-500 mt-1">{{ certificados().length }} certificados cadastrados</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/certificados/novo">
          <mat-icon class="mr-1">add</mat-icon>
          Novo Certificado
        </a>
      </div>

      @if (carregando()) {
        <div class="flex justify-center py-12"><mat-spinner diameter="40"></mat-spinner></div>
      }

      @if (!carregando() && certificados().length === 0) {
        <div class="text-center py-16 bg-white rounded-xl border border-gray-100">
          <mat-icon class="text-gray-300 text-6xl w-16 h-16">verified</mat-icon>
          <p class="mt-4 text-gray-500">Nenhum certificado cadastrado ainda.</p>
          <a mat-stroked-button routerLink="/certificados/novo" class="mt-4">
            Adicionar primeiro certificado
          </a>
        </div>
      }

      @if (!carregando()) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (cert of certificados(); track cert.id) {
            <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              @if (cert.imageUrl) {
                <img [src]="cert.imageUrl" [alt]="cert.title" class="w-full h-32 object-contain rounded-lg bg-gray-50 p-2" />
              } @else {
                <div class="w-full h-32 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg flex items-center justify-center">
                  <mat-icon class="text-yellow-400 text-4xl w-12 h-12">workspace_premium</mat-icon>
                </div>
              }

              <div>
                <h3 class="font-semibold text-gray-900 text-sm line-clamp-2">{{ cert.title }}</h3>
                <p class="text-xs text-indigo-600 mt-0.5">{{ cert.issuer }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  Emitido em {{ cert.issuedDate | date:'MMM yyyy' }}
                  @if (cert.expiryDate) {
                    — Expira {{ cert.expiryDate | date:'MMM yyyy' }}
                  }
                </p>
              </div>

              <div class="flex gap-2 pt-2 border-t border-gray-50">
                <a mat-stroked-button [routerLink]="['/certificados', cert.id]" class="flex-1 text-xs">
                  <mat-icon class="text-sm mr-1">edit</mat-icon>
                  Editar
                </a>
                <button mat-icon-button color="warn" (click)="confirmarExclusao(cert)">
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
export class CertificateListComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  certificados = signal<Certificate[]>([]);
  carregando = signal(true);

  ngOnInit(): void {
    this.api.getCertificates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.certificados.set(data);
          this.carregando.set(false);
        },
        error: () => {
          this.snackBar.open('Erro ao carregar certificados', 'Fechar', { duration: 3000 });
          this.carregando.set(false);
        }
      });
  }

  confirmarExclusao(cert: Certificate): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        titulo: 'Excluir certificado',
        mensagem: `Deseja excluir o certificado "${cert.title}"?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.api.deleteCertificate(cert.id).subscribe({
          next: () => {
            this.certificados.update(lista => lista.filter(c => c.id !== cert.id));
            this.snackBar.open('Certificado excluido!', 'Fechar', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Erro ao excluir certificado', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
