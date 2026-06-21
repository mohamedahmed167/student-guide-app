import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, RegisterCredentials } from '../../../shared/services/auth.service';
import { Department, DepartmentsService } from '../../../core/services/departments.service';

const passwordsMatch = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirm_password')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly departmentsService = inject(DepartmentsService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly departments = signal<Department[]>([]);
  protected readonly isLoadingDepartments = signal(true);
  protected readonly academicYears = [
    { label: 'First Year', level: 1 }, { label: 'Second Year', level: 2 },
    { label: 'Third Year', level: 3 }, { label: 'Fourth Year', level: 4 },
    { label: 'Fifth Year', level: 5 },
  ];

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      full_name: ['', Validators.required],
      department: ['', Validators.required],
      username: ['', Validators.required],
      current_level: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
      useInviteCode: [false],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    this.departmentsService.getDepartments()
      .pipe(finalize(() => this.isLoadingDepartments.set(false)))
      .subscribe({
        next: (departments) => {
          this.departments.set(departments)
          console.log("departments: ", departments)
        },
        error: (err) => {
          console.log("error from departments", err)
          this.errorMessage.set('Unable to load departments. Please refresh the page.')
        },
      });
  }

  protected submit(): void {
    if (this.registerForm.invalid || this.isSubmitting()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { useInviteCode, confirm_password: _confirmPassword, current_level, ...formValue } = this.registerForm.getRawValue();
    const credentials: RegisterCredentials = {
      ...formValue,
      current_level: Number(current_level),
      ...(useInviteCode ? { invite_code: 'LEADER_SECRET_2026' } : {}),
    };

    this.errorMessage.set('');
    this.isSubmitting.set(true);
    this.authService
      .register(credentials)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/login'),
        error: (error: { error?: unknown }) => {
          this.errorMessage.set(this.formatError(error.error) || 'Unable to create your account. Please try again.');
        },
      });
  }

  private formatError(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') return Object.values(error as Record<string, unknown>).flat().join(' ');
    return '';
  }
}
