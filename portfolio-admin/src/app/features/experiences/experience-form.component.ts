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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ImageUploadComponent
  ],
  template: `
    <div class="max-w-2xl space-y-6">
      <div class="flex items-center gap-3">
        <a mat-icon-button routerLink="/experiencias">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ editando() ? 'Editar Experiencia' : 'Nova Experiencia' }}
          </h1>
        </div>
      </div>

      @if (carregandoDados()) {
        <div class="flex justify-center py-12"><mat-spinner diameter="40"></mat-spinner></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="salvar()" class="space-y-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Empresa</mat-label>
              <input matInput formControlName="company" placeholder="Nome da empresa" />
              @if (form.get('company')?.hasError('required') && form.get('company')?.touched) {
                <mat-error>Empresa obrigatoria</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Cargo</mat-label>
              <input matInput formControlName="role" placeholder="Seu cargo" />
              @if (form.get('role')?.hasError('required') && form.get('role')?.touched) {
                <mat-error>Cargo obrigatorio</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Data de inicio</mat-label>
              <input
                matInput
                [matDatepicker]="pickerInicio"
                formControlName="startDate"
              />
              <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
              <mat-datepicker #pickerInicio></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" [class.opacity-50]="form.get('isCurrent')?.value">
              <mat-label>Data de termino</mat-label>
              <input
                matInput
                [matDatepicker]="pickerFim"
                formControlName="endDate"
                [disabled]="!!form.get('isCurrent')?.value"
              />
              <mat-datepicker-toggle matSuffix [for]="pickerFim"></mat-datepicker-toggle>
              <mat-datepicker #pickerFim></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="flex items-center gap-2 pl-1">
            <mat-checkbox formControlName="isCurrent" color="primary" (change)="aoAlterarAtual()">
              Emprego atual
            </mat-checkbox>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Descricao</mat-label>
            <textarea matInput formControlName="description" rows="4" placeholder="Descreva suas responsabilidades..."></textarea>
          </mat-form-field>

          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <label class="text-sm font-medium text-gray-700 block mb-3">Logo da Empresa</label>
            <app-image-upload
              [urlInicial]="form.get('imageUrl')?.value ?? null"
              (imagemAlterada)="aoAtualizarImagem($event)"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button mat-flat-button color="primary" type="submit" [disabled]="salvando() || form.invalid">
              @if (salvando()) { <mat-spinner diameter="18" class="inline mr-2"></mat-spinner> }
              {{ editando() ? 'Salvar Alteracoes' : 'Criar Experiencia' }}
            </button>
            <a mat-stroked-button routerLink="/experiencias">Cancelar</a>
          </div>
        </form>
      }
    </div>
  `
})
export class ExperienceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  editando = signal(false);
  carregandoDados = signal(false);
  salvando = signal(false);
  private experienciaId = signal<string | null>(null);

  form = this.fb.group({
    company: ['', [Validators.required]],
    role: ['', [Validators.required]],
    startDate: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null],
    description: [''],
    imageUrl: [null as string | null],
    isCurrent: [false]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando.set(true);
      this.experienciaId.set(id);
      this.carregarExperiencia(id);
    }
  }

  carregarExperiencia(id: string): void {
    this.carregandoDados.set(true);
    this.api.getExperience(id).subscribe({
      next: (exp) => {
        this.form.patchValue({
          company: exp.company,
          role: exp.role,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          description: exp.description,
          imageUrl: exp.imageUrl,
          isCurrent: exp.isCurrent
        });
        this.carregandoDados.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar experiencia', 'Fechar', { duration: 3000 });
        this.carregandoDados.set(false);
      }
    });
  }

  aoAlterarAtual(): void {
    if (this.form.get('isCurrent')?.value) {
      this.form.patchValue({ endDate: null });
    }
  }

  aoAtualizarImagem(url: string | null): void {
    this.form.patchValue({ imageUrl: url });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.salvando.set(true);
    const v = this.form.value;
    const dto = {
      company: v.company!,
      role: v.role!,
      startDate: (v.startDate as Date).toISOString(),
      endDate: v.endDate ? (v.endDate as Date).toISOString() : null,
      description: v.description ?? '',
      imageUrl: v.imageUrl ?? null,
      isCurrent: v.isCurrent ?? false
    };

    const operacao = this.editando()
      ? this.api.updateExperience(this.experienciaId()!, dto)
      : this.api.createExperience(dto);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.editando() ? 'Experiencia atualizada!' : 'Experiencia criada!',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/experiencias']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar experiencia', 'Fechar', { duration: 3000 });
        this.salvando.set(false);
      }
    });
  }
}
