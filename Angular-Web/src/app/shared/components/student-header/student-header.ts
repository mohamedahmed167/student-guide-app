import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
@Component({ selector: 'app-student-header', imports: [], templateUrl: './student-header.html' })
export class StudentHeader { private readonly auth = inject(AuthService); private readonly destroyRef = inject(DestroyRef); protected readonly name = signal('Student'); constructor() { this.auth.me().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (profile) => this.name.set(profile.full_name || 'Student') }); } }
