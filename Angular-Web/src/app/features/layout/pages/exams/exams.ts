import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../shared/services/auth.service';
import { CreateExamPayload, Exam, ExamsService } from '../../../../core/services/exams.service';
import { Subject } from '../../../../core/services/schedules.service';

@Component({ selector: 'app-exams', imports: [DatePipe, FormsModule], templateUrl: './exams.html', styleUrl: './exams.css' })
export class Exams {
  private readonly examsService = inject(ExamsService); private readonly authService = inject(AuthService); private readonly destroyRef = inject(DestroyRef);
  protected readonly exams = signal<Exam[]>([]); protected readonly subjects = signal<Subject[]>([]); protected readonly isLoading = signal(true); protected readonly isSaving = signal(false); protected readonly showForm = signal(false); protected readonly error = signal('');
  protected profile: { current_level?: number; department?: string | number } = {};
  protected form: CreateExamPayload = this.emptyForm();
  constructor() { this.load(); }
  protected load(): void { this.isLoading.set(true); this.error.set(''); forkJoin({ exams: this.examsService.getExams(), profile: this.authService.me() }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false))).subscribe({ next: ({ exams, profile }) => { this.exams.set(exams); this.subjects.set(profile.subjects ?? []); this.profile = { current_level: profile.current_level, department: this.idOf(profile.department) }; this.form = this.emptyForm(); }, error: () => this.error.set('Unable to load exams. Please try again.') }); }
  protected toggleForm(): void { this.showForm.update((open) => !open); this.error.set(''); }
  protected create(): void { if (this.isSaving()) return; const payload: CreateExamPayload = { ...this.form, target_level: this.profile.current_level ?? 1 }; if (this.profile.department) payload.department = this.profile.department; this.isSaving.set(true); this.error.set(''); this.examsService.createExam(payload).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isSaving.set(false))).subscribe({ next: (exam) => { this.exams.update((items) => [...items, exam]); this.form = this.emptyForm(); this.showForm.set(false); }, error: (response) => this.error.set(this.errorText(response) || 'Could not add this exam.') }); }
  private emptyForm(): CreateExamPayload { return { target_level: this.profile.current_level ?? 1, subject: '', exam_date: '', start_time: '', end_time: '', hall_location: '', exam_type: 'midterm' }; }
  private idOf(value: unknown): string | number | undefined { if (typeof value === 'string' || typeof value === 'number') return value; if (value && typeof value === 'object') { const id = (value as Record<string, unknown>)['department_id'] ?? (value as Record<string, unknown>)['id']; return typeof id === 'string' || typeof id === 'number' ? id : undefined; } return undefined; }
  private errorText(response: { error?: unknown }): string { const error = response.error; return typeof error === 'string' ? error : error && typeof error === 'object' ? Object.values(error as Record<string, unknown>).flat().join(' ') : ''; }
}
