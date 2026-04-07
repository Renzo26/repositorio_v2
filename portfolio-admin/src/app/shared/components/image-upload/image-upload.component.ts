import {
  Component, inject, signal, input, output,
  ChangeDetectionStrategy, ElementRef, ViewChild, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSliderModule, FormsModule],
  styles: [`
    .crop-container {
      position: relative;
      width: 240px;
      height: 240px;
      overflow: hidden;
      border-radius: 50%;
      border: 3px solid #6366f1;
      cursor: grab;
      user-select: none;
    }
    .crop-container:active { cursor: grabbing; }
    .crop-img {
      position: absolute;
      transform-origin: center center;
      pointer-events: none;
    }
  `],
  template: `
    <div class="space-y-3">

      <!-- Modal de crop -->
      @if (mostrarCrop()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div class="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 w-[340px]">
            <h3 class="text-base font-semibold text-gray-800">Ajustar enquadramento</h3>

            <!-- Área de crop circular -->
            <div
              class="crop-container"
              (mousedown)="iniciarArraste($event)"
              (mousemove)="moverArraste($event)"
              (mouseup)="pararArraste()"
              (mouseleave)="pararArraste()"
              (touchstart)="iniciarArrasteTouch($event)"
              (touchmove)="moverArrasteTouch($event)"
              (touchend)="pararArraste()"
            >
              <img
                #imgCrop
                [src]="srcCrop()"
                class="crop-img"
                [style.width.px]="imgLargura()"
                [style.height.px]="imgAltura()"
                [style.left.px]="posX()"
                [style.top.px]="posY()"
                (load)="aoCarregarImagem()"
              />
            </div>

            <!-- Slider de zoom -->
            <div class="w-full px-2">
              <label class="text-xs text-gray-500 mb-1 block">Zoom</label>
              <mat-slider min="1" max="3" step="0.05" class="w-full">
                <input matSliderThumb [(ngModel)]="zoom" (ngModelChange)="aoZoom()" />
              </mat-slider>
            </div>

            <div class="flex gap-3 w-full">
              <button mat-stroked-button class="flex-1" (click)="cancelarCrop()" type="button">Cancelar</button>
              <button mat-flat-button color="primary" class="flex-1" (click)="confirmarCrop()" type="button">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Preview da imagem -->
      @if (urlAtual()) {
        <div class="relative w-32">
          <img
            [src]="urlAtual()"
            alt="Foto de perfil"
            class="w-32 h-32 object-cover rounded-full border-2 border-indigo-300"
          />
          <button
            mat-mini-fab
            color="warn"
            class="absolute -top-1 -right-1 !w-7 !h-7 !min-w-0"
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
          <p class="mt-2 text-sm text-gray-600">Clique ou arraste uma imagem aqui</p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG, WebP — maximo 5MB</p>
        }
      </div>

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

    <!-- Canvas oculto para crop -->
    <canvas #canvasCrop class="hidden"></canvas>
  `
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('canvasCrop') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imgCrop') imgRef!: ElementRef<HTMLImageElement>;

  private api = inject(ApiService);

  urlInicial = input<string | null>(null);
  imagemAlterada = output<string | null>();

  urlAtual = signal<string | null>(null);
  carregando = signal(false);
  erro = signal<string | null>(null);

  // Crop state
  mostrarCrop = signal(false);
  srcCrop = signal<string>('');
  zoom = 1;
  posX = signal(0);
  posY = signal(0);
  imgLargura = signal(240);
  imgAltura = signal(240);

  private arrastando = false;
  private ultimoX = 0;
  private ultimoY = 0;
  private imgNatural = { w: 0, h: 0 };
  private arquivoOriginal: File | null = null;
  private readonly FRAME = 240;

  ngOnInit(): void {
    this.urlAtual.set(this.urlInicial());
  }

  aoSelecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (arquivo) this.abrirCrop(arquivo);
    input.value = '';
  }

  aoSoltar(event: DragEvent): void {
    event.preventDefault();
    const arquivo = event.dataTransfer?.files?.[0];
    if (arquivo) this.abrirCrop(arquivo);
  }

  private abrirCrop(arquivo: File): void {
    if (arquivo.size > 5 * 1024 * 1024) {
      this.erro.set('Arquivo muito grande. Maximo 5MB.');
      return;
    }
    this.arquivoOriginal = arquivo;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.srcCrop.set(e.target?.result as string);
      this.zoom = 1;
      this.posX.set(0);
      this.posY.set(0);
      this.mostrarCrop.set(true);
    };
    reader.readAsDataURL(arquivo);
  }

  aoCarregarImagem(): void {
    const img = this.imgRef?.nativeElement;
    if (!img) return;
    this.imgNatural = { w: img.naturalWidth, h: img.naturalHeight };
    this.calcularTamanho();
    this.centralizar();
  }

  private calcularTamanho(): void {
    const { w, h } = this.imgNatural;
    const escala = this.FRAME / Math.min(w, h);
    this.imgLargura.set(Math.round(w * escala * this.zoom));
    this.imgAltura.set(Math.round(h * escala * this.zoom));
  }

  private centralizar(): void {
    this.posX.set((this.FRAME - this.imgLargura()) / 2);
    this.posY.set((this.FRAME - this.imgAltura()) / 2);
  }

  aoZoom(): void {
    const cx = this.FRAME / 2 - this.posX();
    const cy = this.FRAME / 2 - this.posY();
    const ratioX = cx / this.imgLargura();
    const ratioY = cy / this.imgAltura();
    this.calcularTamanho();
    this.posX.set(this.FRAME / 2 - ratioX * this.imgLargura());
    this.posY.set(this.FRAME / 2 - ratioY * this.imgAltura());
    this.clamp();
  }

  iniciarArraste(e: MouseEvent): void {
    this.arrastando = true;
    this.ultimoX = e.clientX;
    this.ultimoY = e.clientY;
  }

  moverArraste(e: MouseEvent): void {
    if (!this.arrastando) return;
    this.posX.set(this.posX() + e.clientX - this.ultimoX);
    this.posY.set(this.posY() + e.clientY - this.ultimoY);
    this.ultimoX = e.clientX;
    this.ultimoY = e.clientY;
    this.clamp();
  }

  pararArraste(): void { this.arrastando = false; }

  iniciarArrasteTouch(e: TouchEvent): void {
    this.arrastando = true;
    this.ultimoX = e.touches[0].clientX;
    this.ultimoY = e.touches[0].clientY;
  }

  moverArrasteTouch(e: TouchEvent): void {
    if (!this.arrastando) return;
    e.preventDefault();
    this.posX.set(this.posX() + e.touches[0].clientX - this.ultimoX);
    this.posY.set(this.posY() + e.touches[0].clientY - this.ultimoY);
    this.ultimoX = e.touches[0].clientX;
    this.ultimoY = e.touches[0].clientY;
    this.clamp();
  }

  private clamp(): void {
    const maxX = 0;
    const minX = this.FRAME - this.imgLargura();
    const maxY = 0;
    const minY = this.FRAME - this.imgAltura();
    this.posX.set(Math.min(maxX, Math.max(minX, this.posX())));
    this.posY.set(Math.min(maxY, Math.max(minY, this.posY())));
  }

  cancelarCrop(): void {
    this.mostrarCrop.set(false);
    this.arquivoOriginal = null;
  }

  confirmarCrop(): void {
    const canvas = this.canvasRef.nativeElement;
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      const scaleCanvas = size / this.FRAME;
      ctx.drawImage(
        img,
        this.posX() * scaleCanvas,
        this.posY() * scaleCanvas,
        this.imgLargura() * scaleCanvas,
        this.imgAltura() * scaleCanvas
      );

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        this.mostrarCrop.set(false);
        this.fazerUpload(file);
      }, 'image/jpeg', 0.92);
    };
    img.src = this.srcCrop();
  }

  removerImagem(): void {
    this.urlAtual.set(null);
    this.imagemAlterada.emit(null);
  }

  private fazerUpload(arquivo: File): void {
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
