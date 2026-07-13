import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  readonly isProduction = environment.production;
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const email = String(this.loginForm.value.email).trim().toLowerCase();
    const password = String(this.loginForm.value.password);

    this.authService.login(email, password).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: (err: { status?: number; error?: { message?: string } }) => {
        this.error =
          err.status === 0
            ? 'A API está indisponível. Confirme se o back-end está em execução.'
            : err?.error?.message || 'Erro ao fazer login. Tente novamente.';
        this.isLoading = false;
      },
    });
  }
}
