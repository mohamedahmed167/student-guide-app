import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../shared/services/auth.service';
import { Subject } from '../../../../core/services/schedules.service';

interface GradeEntry { subject: Subject; grade: string; }
const points: Record<string, number> = { 'A+': 4, A: 4, 'A-': 3.7, 'B+': 3.3, B: 3, 'B-': 2.7, 'C+': 2.3, C: 2, 'C-': 1.7, D: 1, F: 0 };

@Component({ selector: 'app-gpa', imports: [DecimalPipe, FormsModule], templateUrl: './gpa.html', styleUrl: './gpa.css' })
export class Gpa {
  private readonly auth = inject(AuthService); private readonly destroyRef = inject(DestroyRef);
  protected readonly profile = signal<any | null>(null); protected readonly entries = signal<GradeEntry[]>([]); protected readonly isLoading = signal(true); protected readonly error = signal('');
  protected readonly projectedGpa = computed(() => { const selected = this.entries().filter((entry) => entry.grade); const credits = selected.reduce((total, entry) => total + (entry.subject.credits ?? 0), 0); return credits ? selected.reduce((total, entry) => total + (points[entry.grade] ?? 0) * (entry.subject.credits ?? 0), 0) / credits : null; });
  protected readonly attemptedCredits = computed(() => this.entries().filter((entry) => entry.grade).reduce((total, entry) => total + (entry.subject.credits ?? 0), 0));
  protected readonly grades = Object.keys(points);
  protected readonly points = points;
  constructor() { this.load(); }
  protected load(): void { this.isLoading.set(true); this.error.set(''); this.auth.me().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false))).subscribe({ next: (profile) => { this.profile.set(profile); this.entries.set((profile.subjects ?? []).map((subject: Subject) => ({ subject, grade: '' }))); }, error: () => this.error.set('Unable to load your academic profile.') }); }
  protected updateGrade(index: number, grade: string): void { this.entries.update((entries) => entries.map((entry, entryIndex) => entryIndex === index ? { ...entry, grade } : entry)); }
}
