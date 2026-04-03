import {
  Component, inject, signal, OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-project-form',
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
    ImageUploadComponent
  ],
  template: `
    <div class="max-w-2xl space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <a mat-icon-button routerLink="/projetos">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ editando() ? 'Editar Projeto' : 'Novo Projeto' }}
          </h1>
          <p class="text-sm text-gray-500">Preencha os dados do projeto</p>
        </div>
      </div>

      @if (carregandoDados()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="salvar()" class="space-y-5">

          <!-- Titulo -->
          <mat-form-field appearance="outline">
            <mat-label>Titulo</mat-label>
            <input matInput formControlName="title" placeholder="Nome do projeto" />
            @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
              <mat-error>Titulo obrigatorio</mat-error>
            }
          </mat-form-field>

          <!-- Descricao -->
          <mat-form-field appearance="outline">
            <mat-label>Descricao</mat-label>
            <textarea
              matInput
              formControlName="description"
              rows="4"
              placeholder="Descricao do projeto..."
            ></textarea>
          </mat-form-field>

          <!-- Tecnologias -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Tecnologias</label>
              <button type="button" mat-stroked-button (click)="adicionarTecnologia()">
                <mat-icon class="text-sm mr-1">add</mat-icon>
                Adicionar
              </button>
            </div>

            <div formArrayName="technologies" class="space-y-2">
              @for (ctrl of tecnologias.controls; track $index) {
                <div class="flex gap-2">
                  <mat-form-field appearance="outline" class="flex-1">
                    <input
                      matInput
                      [formControl]="$any(ctrl)"
                      placeholder="Ex: React, TypeScript..."
                    />
                  </mat-form-field>
                  <button
                    type="button"
                    mat-icon-button
                    color="warn"
                    (click)="removerTecnologia($index)"
                  >
                    <mat-icon>remove_circle</mat-icon>
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- URLs -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>URL do Demo</mat-label>
              <mat-icon matPrefix class="mr-2 text-gray-400">open_in_new</mat-icon>
              <input matInput formControlName="demoUrl" placeholder="https://..." />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>URL do Repositorio</mat-label>
              <mat-icon matPrefix class="mr-2 text-gray-400">code</mat-icon>
              <input matInput formControlName="repoUrl" placeholder="https://github.com/..." />
            </mat-form-field>
          </div>

          <!-- Ordem e Featured -->
          <div class="grid grid-cols-2 gap-4 items-center">
            <mat-form-field appearance="outline">
              <mat-label>Ordem de exibicao</mat-label>
              <input matInput type="number" formControlName="order" />
            </mat-form-field>

            <div class="flex items-center gap-2 pl-2">
              <mat-checkbox formControlName="featured" color="primary">
                Projeto em destaque
              </mat-checkbox>
            </div>
          </div>

          <!-- Upload de imagem -->
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <label class="text-sm font-medium text-gray-700 block mb-3">Imagem do Projeto</label>
            <app-image-upload
              [urlInicial]="form.get('imageUrl')?.value ?? null"
              (imagemAlterada)="aoAtualizarImagem($event)"
            />
          </div>

          <!-- Botoes -->
          <div class="flex gap-3 pt-2">
            <button
              mat-flat-button
              color="primary"
              type="submit"
              [disabled]="salvando() || form.invalid"
            >
              @if (salvando()) {
                <mat-spinner diameter="18" class="inline mr-2"></mat-spinner>
              }
              {{ editando() ? 'Salvar Alteracoes' : 'Criar Projeto' }}
            </button>
            <a mat-stroked-button routerLink="/projetos">Cancelar</a>
          </div>
        </form>
      }
    </div>
  `
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  editando = signal(false);
  carregandoDados = signal(false);
  salvando = signal(false);
  private projetoId = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(2000)]],
    technologies: this.fb.array<string>([]),
    imageUrl: [null as string | null],
    demoUrl: [null as string | null],
    repoUrl: [null as string | null],
    featured: [false],
    order: [0]
  });

  get tecnologias(): FormArray {
    return this.form.get('technologies') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando.set(true);
      this.projetoId.set(id);
      this.carregarProjeto(id);
    }
  }

  carregarProjeto(id: string): void {
    this.carregandoDados.set(true);
    this.api.getProject(id).subscribe({
      next: (projeto) => {
        // Limpa o array de tecnologias
        while (this.tecnologias.length) {
          this.tecnologias.removeAt(0);
        }

        // Adiciona tecnologias ao FormArray
        projeto.technologies.forEach(tech => {
          this.tecnologias.push(this.fb.control(tech));
        });

        this.form.patchValue({
          title: projeto.title,
          description: projeto.description,
          imageUrl: projeto.imageUrl,
          demoUrl: projeto.demoUrl,
          repoUrl: projeto.repoUrl,
          featured: projeto.featured,
          order: projeto.order
        });

        this.carregandoDados.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar projeto', 'Fechar', { duration: 3000 });
        this.carregandoDados.set(false);
      }
    });
  }

  adicionarTecnologia(): void {
    this.tecnologias.push(this.fb.control(''));
  }

  removerTecnologia(index: number): void {
    this.tecnologias.removeAt(index);
  }

  aoAtualizarImagem(url: string | null): void {
    this.form.patchValue({ imageUrl: url });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.salvando.set(true);
    const dto = {
      title: this.form.value.title!,
      description: this.form.value.description ?? '',
      technologies: (this.form.value.technologies as string[]).filter(t => t.trim()),
      imageUrl: this.form.value.imageUrl ?? null,
      demoUrl: this.form.value.demoUrl ?? null,
      repoUrl: this.form.value.repoUrl ?? null,
      featured: this.form.value.featured ?? false,
      order: this.form.value.order ?? 0
    };

    const operacao = this.editando()
      ? this.api.updateProject(this.projetoId()!, dto)
      : this.api.createProject(dto);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(
          this.editando() ? 'Projeto atualizado!' : 'Projeto criado!',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/projetos']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar projeto', 'Fechar', { duration: 3000 });
        this.salvando.set(false);
      }
    });
  }
}
