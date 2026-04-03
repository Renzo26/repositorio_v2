import {
  Component, inject, signal, input, output,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="space-y-3">
      <!-- Preview da imagem -->
      @if (urlAtual()) {
        <div class="relative w-full max-w-sm">
          <img
            [src]="urlAtual()"
            alt="Preview da imagem"
            class="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            mat-mini-fab
            color="warn"
            class="absolute top-2 right-2 !w-7 !h-7 !min-w-0"
            (click)="removerImagem()"
            type="button"
          >
            <mat-icon class="text-sm">close</mat-icon>
          </button>
        </div>
      }

      <!-- Zona de upload -->
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
        (click)="inputArquivo.click()"
        (dragover)="$event.preventDefault()"
        (drop)="aoSoltar($event)"
      >
        @if (carregando()) {
          <mat-spinner diameter="32" class="mx-auto"></mat-spinner>
          <p class="mt-2 text-sm text-gray-500">Fazendo upload...</p>
        } @else {
          <mat-icon class="text-gray-400 text-4xl w-10 h-10">cloud_upload</mat-icon>
          <p class="mt-2 text-sm text-gray-600">
            Clique ou arraste uma imagem aqui
          </p>
          <p class="text-xs text-gray-400 mt-1">
            PNG, JPG, WebP — maximo 5MB
          </p>
        }
      </div>

      <!-- Input oculto -->
      <input
        #inputArquivo
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        class="hidden"
        (change)="aoSelecionarArquivo($event)"
      />

      @if (erro()) {
        <p class="text-sm text-red-600">{{ erro() }}</p>
      }
    </div>
  `
})
export class ImageUploadComponent {
  private api = inject(ApiService);

  // Inputs/Outputs
  urlInicial = input<string | null>(null);
  imagemAlterada = output<string | null>();

  // Estado interno
  urlAtual = signal<string | null>(null);
  carregando = signal(false);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.urlAtual.set(this.urlInicial());
  }

  aoSelecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (arquivo) {
      this.fazerUpload(arquivo);
    }
  }

  aoSoltar(event: DragEvent): void {
    event.preventDefault();
    const arquivo = event.dataTransfer?.files?.[0];
    if (arquivo) {
      this.fazerUpload(arquivo);
    }
  }

  removerImagem(): void {
    this.urlAtual.set(null);
    this.imagemAlterada.emit(null);
  }

  private fazerUpload(arquivo: File): void {
    if (arquivo.size > 5 * 1024 * 1024) {
      this.erro.set('Arquivo muito grande. Maximo 5MB.');
      return;
    }

    this.erro.set(null);
    this.carregando.set(true);

    this.api.uploadImage(arquivo).subscribe({
      next: (response) => {
        this.urlAtual.set(response.url);
        this.imagemAlterada.emit(response.url);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao fazer upload. Tente novamente.');
        this.carregando.set(false);
        console.error('Erro no upload:', err);
      }
    });
  }
}
