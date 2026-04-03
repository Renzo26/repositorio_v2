import {
  Component, inject, signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-white">web</mat-icon>
          </div>
          <h1 class="text-xl font-bold text-gray-900">Portfolio Admin</h1>
          <p class="text-sm text-gray-500 mt-1">Entre com sua senha de acesso</p>
        </div>

        <!-- Formulario -->
        <form [formGroup]="form" (ngSubmit)="entrar()" class="space-y-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Senha</mat-label>
            <input
              matInput
              [type]="mostrarSenha() ? 'text' : 'password'"
              formControlName="password"
              placeholder="Digite sua senha"
            />
            <button
              type="button"
              mat-icon-button
              matSuffix
              (click)="toggleSenha()"
            >
              <mat-icon>{{ mostrarSenha() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
              <mat-error>Senha obrigatoria</mat-error>
            }
          </mat-form-field>

          @if (erroLogin()) {
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm text-red-700">{{ erroLogin() }}</p>
            </div>
          }

          <button
            mat-flat-button
            color="primary"
            type="submit"
            class="w-full"
            [disabled]="carregando() || form.invalid"
          >
            @if (carregando()) {
              <mat-spinner diameter="20" class="inline mr-2"></mat-spinner>
              Entrando...
            } @else {
              Entrar
            }
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    password: ['', [Validators.required]]
  });

  carregando = signal(false);
  erroLogin = signal<string | null>(null);
  mostrarSenha = signal(false);

  toggleSenha(): void {
    this.mostrarSenha.update(v => !v);
  }

  entrar(): void {
    if (this.form.invalid) return;

    this.carregando.set(true);
    this.erroLogin.set(null);

    const password = this.form.value.password!;

    this.auth.login(password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.carregando.set(false);
        if (err.status === 401) {
          this.erroLogin.set('Senha incorreta. Tente novamente.');
        } else {
          this.erroLogin.set('Erro ao conectar com o servidor.');
        }
      }
    });
  }
}
