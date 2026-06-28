import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isOpen = signal(false);
  protected readonly isLoggingOut = signal(false);
  protected readonly logoutError = signal('');

  protected readonly navigation = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Schedule Manager', path: '/schedule', icon: 'calendar' },
    { label: 'Exams Manager', path: '/exams', icon: 'calendar' },
    { label: 'Announcements', path: '/announcements', icon: 'announcement' },
    { label: 'Students', path: '/students', icon: 'students' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected logout(): void {
    if (this.isLoggingOut()) {
      return;
    }

    this.logoutError.set('');
    this.isLoggingOut.set(true);

    this.authService
      .logout()
      .pipe(finalize(() => this.isLoggingOut.set(false)))
      .subscribe({
        next: () => {
          this.close();
          this.router.navigateByUrl('/login');
        },
        error: () => this.logoutError.set('Unable to log out. Please try again.'),
      });
  }
}
