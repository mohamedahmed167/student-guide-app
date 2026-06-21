import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
	selector: 'app-login',
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: './login.html',
	styleUrl: './login.css',
})
export class Login {
	private readonly formBuilder = inject(FormBuilder);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	protected readonly isSubmitting = signal(false);
	protected readonly showPassword = signal(false);
	protected readonly errorMessage = signal('');

	protected readonly loginForm = this.formBuilder.nonNullable.group({
		username: ['', [Validators.required]],
		password: ['', [Validators.required]],
	});

	protected submit(): void {
		if (this.loginForm.invalid || this.isSubmitting()) {
			this.loginForm.markAllAsTouched();
			return;
		}

		this.errorMessage.set('');
		this.isSubmitting.set(true);
		const { username, password } = this.loginForm.getRawValue();

		this.authService
			.login({ username, password })
			.pipe(finalize(() => this.isSubmitting.set(false)))
			.subscribe({
        next: (res) => {
                    this.router.navigateByUrl(res?.student?.role === 'student' ? '/student/dashboard' : '/dashboard');
				},
				error: (error: { error?: { message?: string; detail?: string } }) => {
					this.errorMessage.set(
						error.error?.message ?? error.error?.detail ?? 'Unable to sign in. Check your username and password.',
					);
				},
			});
	}
}
