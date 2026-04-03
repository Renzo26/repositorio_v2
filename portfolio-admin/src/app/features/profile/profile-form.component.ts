import {
  Component, inject, signal, OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ImageUploadComponent
  ],
  template: `
    <div class="max-w-2xl space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p class="text-sm text-gray-500 mt-1">Informacoes exibidas publicamente no portfolio</p>
      </div>

      @if (carregando()) {
        <div class="flex justify-center py-12"><mat-spinner diameter="40"></mat-spinner></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="salvar()" class="space-y-5">

          <!-- Avatar -->
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <label class="text-sm font-medium text-gray-700 block mb-3">Foto de Perfil</label>
            <app-image-upload
              [urlInicial]="form.get('avatarUrl')?.value ?? null"
              (imagemAlterada)="aoAtualizarAvatar($event)"
            />
          </div>

          <!-- Dados basicos -->
          <div class="grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Nome completo</mat-label>
              <input matInput formControlName="name" />
              @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                <mat-error>Nome obrigatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Titulo profissional</mat-label>
              <input matInput formControlName="title" placeholder="Ex: Desenvolvedor Full-Stack" />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Bio</mat-label>
            <textarea
              matInput
              formControlName="bio"
              rows="4"
              placeholder="Uma breve descricao sobre voce..."
            ></textarea>
          </mat-form-field>

          <!-- Contato -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h3 class="text-sm font-medium text-gray-700">Contato</h3>

            <div class="grid gap-4 sm:grid-cols-2">
              <mat-form-field appearance="outline">
                <mat-label>E-mail</mat-label>
                <mat-icon matPrefix class="mr-2 text-gray-400">email</mat-icon>
                <input matInput type="email" formControlName="email" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Telefone</mat-label>
                <mat-icon matPrefix class="mr-2 text-gray-400">phone</mat-icon>
                <input matInput formControlName="phone" placeholder="+55 11 99999-9999" />
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Localizacao</mat-label>
              <mat-icon matPrefix class="mr-2 text-gray-400">location_on</mat-icon>
              <input matInput formControlName="location" placeholder="Ex: Sao Paulo, SP" />
            </mat-form-field>
          </div>

          <!-- Redes sociais -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h3 class="text-sm font-medium text-gray-700">Redes Sociais</h3>

            <mat-form-field appearance="outline">
              <mat-label>LinkedIn</mat-label>
              <mat-icon matPrefix class="mr-2 text-gray-400">link</mat-icon>
              <input matInput formControlName="linkedinUrl" placeholder="https://linkedin.com/in/..." />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>GitHub</mat-label>
              <mat-icon matPrefix class="mr-2 text-gray-400">code</mat-icon>
              <input matInput formControlName="githubUrl" placeholder="https://github.com/..." />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Website</mat-label>
              <mat-icon matPrefix class="mr-2 text-gray-400">language</mat-icon>
              <input matInput formControlName="websiteUrl" placeholder="https://seusite.com" />
            </mat-form-field>
          </div>

          <div class="flex gap-3 pt-2">
            <button mat-flat-button color="primary" type="submit" [disabled]="salvando() || form.invalid">
              @if (salvando()) { <mat-spinner diameter="18" class="inline mr-2"></mat-spinner> }
              Salvar Perfil
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class ProfileFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  carregando = signal(true);
  salvando = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required]],
    title: [''],
    bio: [''],
    email: [''],
    phone: [''],
    location: [''],
    avatarUrl: [null as string | null],
    linkedinUrl: [null as string | null],
    githubUrl: [null as string | null],
    websiteUrl: [null as string | null]
  });

  ngOnInit(): void {
    this.api.getProfile().subscribe({
      next: (profile) => {
        this.form.patchValue({
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          avatarUrl: profile.avatarUrl,
          linkedinUrl: profile.linkedinUrl,
          githubUrl: profile.githubUrl,
          websiteUrl: profile.websiteUrl
        });
        this.carregando.set(false);
      },
      error: (err) => {
        // 404 significa que o perfil ainda nao foi criado — ok
        if (err.status !== 404) {
          this.snackBar.open('Erro ao carregar perfil', 'Fechar', { duration: 3000 });
        }
        this.carregando.set(false);
      }
    });
  }

  aoAtualizarAvatar(url: string | null): void {
    this.form.patchValue({ avatarUrl: url });
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;
    const dto = {
      name: v.name!,
      title: v.title ?? '',
      bio: v.bio ?? '',
      email: v.email ?? null,
      phone: v.phone ?? null,
      location: v.location ?? null,
      avatarUrl: v.avatarUrl ?? null,
      linkedinUrl: v.linkedinUrl ?? null,
      githubUrl: v.githubUrl ?? null,
      websiteUrl: v.websiteUrl ?? null
    };

    this.api.updateProfile(dto).subscribe({
      next: () => {
        this.snackBar.open('Perfil salvo com sucesso!', 'Fechar', { duration: 3000 });
        this.salvando.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar perfil', 'Fechar', { duration: 3000 });
        this.salvando.set(false);
      }
    });
  }
}
