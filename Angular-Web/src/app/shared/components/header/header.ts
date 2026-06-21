import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface CurrentUser {
    full_name?: string;
    name?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    user?: CurrentUser;
}

@Component({
    selector: 'app-header',
    imports: [],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header implements OnInit {
    private readonly authService = inject(AuthService);

    protected readonly user = signal<CurrentUser | null>(null);
    protected readonly displayName = computed(() => this.getDisplayName(this.user()));
    protected readonly initials = computed(() => this.displayName().slice(0, 1).toUpperCase());


    ngOnInit(): void {
        this.authService.me().subscribe({
            next: (user) => {
                this.user.set(user);
            },
        });
    }

    private getDisplayName(user: CurrentUser | null): string {
        const account = user?.user ?? user;
        const fullName = [account?.first_name, account?.last_name].filter(Boolean).join(' ');

        return user?.full_name || account?.full_name || account?.name || fullName || account?.username || 'Student';
    }
}
