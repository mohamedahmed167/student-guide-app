import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({ selector: 'app-profile', imports: [], templateUrl: './profile.html', styleUrl: './profile.css' })
export class Profile {
  private readonly auth = inject(AuthService); private readonly destroyRef = inject(DestroyRef);
  protected readonly profile = signal<any | null>(null); protected readonly isLoading = signal(true); protected readonly error = signal('');
  constructor() { this.load(); }
  protected load(): void { this.isLoading.set(true); this.error.set(''); this.auth.me().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false))).subscribe({ next: (profile) => this.profile.set(profile), error: () => this.error.set('Unable to load your profile.') }); }
  protected initials(name: string): string { return name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase(); }
}
