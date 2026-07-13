import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompaniesService } from '../../../services/companies.service';
import { Company } from '../../../models/data.models';

@Component({
  selector: 'app-companies-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './companies-crud.html',
  styleUrls: ['../machines-crud/machines-crud.css'],
})
export class CompaniesCrud implements OnInit {
  private companiesService = inject(CompaniesService);
  private fb = inject(FormBuilder);

  companies: Company[] = [];
  companyForm: FormGroup;
  showForm = false;
  isEditing = false;
  currentCompanyId: string | null = null;
  loading = false;
  errorMessage = '';

  constructor() {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      industry: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: [''],
      city: [''],
      state: [''],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.errorMessage = '';
    this.companiesService.getCompanies().subscribe({
      next: (data: Company[]) => {
        this.companies = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar as empresas.';
        this.loading = false;
      },
    });
  }

  openForm(company?: Company): void {
    this.showForm = true;
    if (company) {
      this.isEditing = true;
      this.currentCompanyId = company.id;
      this.companyForm.patchValue(company);
    } else {
      this.isEditing = false;
      this.currentCompanyId = null;
      this.companyForm.reset({ isActive: true });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const raw = this.companyForm.value;
    const formData = {
      ...raw,
      contactPhone: raw.contactPhone || undefined,
      city: raw.city || undefined,
      state: raw.state || undefined,
    };

    if (this.isEditing && this.currentCompanyId) {
      this.companiesService.updateCompany(this.currentCompanyId, formData).subscribe({
        next: () => {
          this.loadCompanies();
          this.closeForm();
        },
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível atualizar a empresa.');
          this.loading = false;
        },
      });
    } else {
      this.companiesService.createCompany(formData).subscribe({
        next: () => {
          this.loadCompanies();
          this.closeForm();
        },
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível criar a empresa.');
          this.loading = false;
        },
      });
    }
  }

  deleteCompany(id: string): void {
    if (
      confirm(
        'Atenção: Excluir uma empresa removerá todas as máquinas e usuários associados. Tem certeza?',
      )
    ) {
      this.loading = true;
      this.companiesService.deleteCompany(id).subscribe({
        next: () => this.loadCompanies(),
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível excluir a empresa.');
          this.loading = false;
        },
      });
    }
  }

  private getErrorMessage(
    error: { error?: { message?: string | string[] } },
    fallback: string,
  ): string {
    const message = error.error?.message;
    return Array.isArray(message) ? message.join(' ') : message || fallback;
  }
}
