import {
  Component, inject, signal, OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ImageUploadComponent
  ],
  template: `
    <div class="max-w-2xl space-y-6">
      <div class="flex items-center gap-3">
        <a mat-icon-button routerLink="/certificados">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ editando() ? 'Editar Certificado' : 'Novo Certificado' }}
        </h1>
      </div>

      @if (carregandoDados()) {
        <div class="flex justify-center py-12"><mat-spinner diameter="40"></mat-spinner></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="salvar()" class="space-y-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Titulo do Certificado</mat-label>
              <input matInput formControlName="title" />
              @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
                <mat-error>Titulo obrigatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Emissor</mat-label>
              <input matInput formControlName="issuer" placeholder="Ex: AWS, Google, Udemy..." />
            </mat-form-field>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Data de emissao</mat-label>
              <input matInput [matDatepicker]="pickerEmissao" formControlName="issuedDate" />
              <mat-datepicker-toggle matSuffix [for]="pickerEmissao"></mat-datepicker-toggle>
              <mat-datepicker #pickerEmissao></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Data de expiracao (opcional)</mat-label>
              <input matInput [matDatepicker]="pickerExpira" formControlName="expiryDate" />
              <mat-datepicker-toggle matSuffix [for]="pickerExpira"></mat-datepicker-toggle>
              <mat-datepicker #pickerExpira></mat-datepicker>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>URL da credencial (opcional)</mat-label>
            <mat-icon matPrefix class="mr-2 text-gray-400">link</mat-icon>
            <input matInput formControlName="credentialUrl" placeholder="https://..." />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Descricao (opcional)</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>

          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <label class="text-sm font-medium text-gray-700 block mb-3">Imagem / Badge</label>
            <app-image-upload
              [urlInicial]="form.get('imageUrl')?.value ?? null"
              (imagemAlterada)="aoAtualizarImagem($event)"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button mat-flat-button color="primary" type="submit" [disabled]="salvando() || form.invalid">
              @if (salvando()) { <mat-spinner diameter="18" class="inline mr-2"></mat-spinner> }
              {{ editando() ? 'Salvar Alteracoes' : 'Criar Certificado' }}
            </button>
            <a mat-stroked-button routerLink="/certificados">Cancelar</a>
          </div>
        </form>
      }
    </div>
  `
})
export class CertificateFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  editando = signal(false);
  carregandoDados = signal(false);
  salvando = signal(false);
  private certificadoId = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required]],
    issuer: ['', [Validators.required]],
    issuedDate: [null as Date | null, [Validators.required]],
    expiryDate: [null as Date | null],
    credentialUrl: [null as string | null],
    imageUrl: [null as string | null],
    description: [null as string | null]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando.set(true);
      this.certificadoId.set(id);
      this.carregarCertificado(id);
    }
  }

  carregarCertificado(id: string): void {
    this.carregandoDados.set(true);
    this.api.getCertificate(id).subscribe({
      next: (cert) => {
        this.form.patchValue({
          title: cert.title,
          issuer: cert.issuer,
          issuedDate: new Date(cert.issuedDate),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
          credentialUrl: cert.credentialUrl,
          imageUrl: cert.imageUrl,
          description: cert.description
        });
        this.carregandoDados.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar certificado', 'Fechar', { duration: 3000 });
        this.carregandoDados.set(false);
      }
    });
  }

  aoAtualizarImagem(url: string | null): void {
    this.form.patchValue({ imageUrl: url });
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;
    const dto = {
      title: v.title!,
      issuer: v.issuer!,
      issuedDate: (v.issuedDate as Date).toISOString(),
      expiryDate: v.expiryDate ? (v.expiryDate as Date).toISOString() : null,
      credentialUrl: v.credentialUrl ?? null,
      imageUrl: v.imageUrl ?? null,
      description: v.description ?? null
    };

    const operacao = this.editando()
      ? this.api.updateCertificate(this.certificadoId()!, dto)
      : this.api.createCertificate(dto);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.editando() ? 'Certificado atualizado!' : 'Certificado criado!',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/certificados']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar certificado', 'Fechar', { duration: 3000 });
        this.salvando.set(false);
      }
    });
  }
}
