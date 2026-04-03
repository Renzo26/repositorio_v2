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
  selector: 'app-education-form',
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
        <a mat-icon-button routerLink="/educacao">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ editando() ? 'Editar Formacao' : 'Nova Formacao' }}
        </h1>
      </div>

      @if (carregandoDados()) {
        <div class="flex justify-center py-12"><mat-spinner diameter="40"></mat-spinner></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="salvar()" class="space-y-5">
          <mat-form-field appearance="outline">
            <mat-label>Instituicao</mat-label>
            <input matInput formControlName="institution" placeholder="Nome da universidade/escola" />
            @if (form.get('institution')?.hasError('required') && form.get('institution')?.touched) {
              <mat-error>Instituicao obrigatoria</mat-error>
            }
          </mat-form-field>

          <div class="grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Grau</mat-label>
              <input matInput formControlName="degree" placeholder="Ex: Bacharelado, Tecnologo..." />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Area</mat-label>
              <input matInput formControlName="field" placeholder="Ex: Ciencia da Computacao..." />
            </mat-form-field>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Data de inicio</mat-label>
              <input matInput [matDatepicker]="pickerInicio" formControlName="startDate" />
              <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
              <mat-datepicker #pickerInicio></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Data de conclusao (opcional)</mat-label>
              <input matInput [matDatepicker]="pickerFim" formControlName="endDate" />
              <mat-datepicker-toggle matSuffix [for]="pickerFim"></mat-datepicker-toggle>
              <mat-datepicker #pickerFim></mat-datepicker>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Descricao (opcional)</mat-label>
            <textarea matInput formControlName="description" rows="3"></textarea>
          </mat-form-field>

          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <label class="text-sm font-medium text-gray-700 block mb-3">Logo da Instituicao</label>
            <app-image-upload
              [urlInicial]="form.get('imageUrl')?.value ?? null"
              (imagemAlterada)="aoAtualizarImagem($event)"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button mat-flat-button color="primary" type="submit" [disabled]="salvando() || form.invalid">
              @if (salvando()) { <mat-spinner diameter="18" class="inline mr-2"></mat-spinner> }
              {{ editando() ? 'Salvar Alteracoes' : 'Criar Formacao' }}
            </button>
            <a mat-stroked-button routerLink="/educacao">Cancelar</a>
          </div>
        </form>
      }
    </div>
  `
})
export class EducationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  editando = signal(false);
  carregandoDados = signal(false);
  salvando = signal(false);
  private educacaoId = signal<string | null>(null);

  form = this.fb.group({
    institution: ['', [Validators.required]],
    degree: ['', [Validators.required]],
    field: [''],
    startDate: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null],
    description: [null as string | null],
    imageUrl: [null as string | null]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando.set(true);
      this.educacaoId.set(id);
      this.carregarEducacao(id);
    }
  }

  carregarEducacao(id: string): void {
    this.carregandoDados.set(true);
    this.api.getEducation(id).subscribe({
      next: (edu) => {
        this.form.patchValue({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
          description: edu.description,
          imageUrl: edu.imageUrl
        });
        this.carregandoDados.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar formacao', 'Fechar', { duration: 3000 });
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
      institution: v.institution!,
      degree: v.degree!,
      field: v.field ?? '',
      startDate: (v.startDate as Date).toISOString(),
      endDate: v.endDate ? (v.endDate as Date).toISOString() : null,
      description: v.description ?? null,
      imageUrl: v.imageUrl ?? null
    };

    const operacao = this.editando()
      ? this.api.updateEducation(this.educacaoId()!, dto)
      : this.api.createEducation(dto);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.editando() ? 'Formacao atualizada!' : 'Formacao criada!',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/educacao']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar formacao', 'Fechar', { duration: 3000 });
        this.salvando.set(false);
      }
    });
  }
}
