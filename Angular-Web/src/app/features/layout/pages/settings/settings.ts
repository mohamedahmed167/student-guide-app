import { Component, DestroyRef, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-settings',
    imports: [],
    templateUrl: './settings.html',
    styleUrl: './settings.css',
})
export class Settings {
  private readonly authService = inject(AuthService); private readonly destroyRef = inject(DestroyRef);
  protected readonly profile = signal<any | null>(null); protected readonly isLoading = signal(true); protected readonly error = signal('');
  constructor() { this.load(); }
  protected load(): void { this.isLoading.set(true); this.error.set(''); this.authService.me().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false))).subscribe({ next: (profile) => this.profile.set(profile), error: () => this.error.set('Unable to load profile settings.') }); }
}
