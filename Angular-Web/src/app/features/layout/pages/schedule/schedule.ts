import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../shared/services/auth.service';
import { CreateSchedulePayload, Schedule as ScheduleEntry, SchedulesService, Subject } from '../../../../core/services/schedules.service';

@Component({
    selector: 'app-schedule',
    imports: [FormsModule],
    templateUrl: './schedule.html',
    styleUrl: './schedule.css',
})
export class Schedule {
  private readonly schedulesService = inject(SchedulesService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly schedules = signal<ScheduleEntry[]>([]);
  protected readonly subjects = signal<Subject[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly showForm = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');
  protected profile: { department?: string | number; current_level?: number } = {};
  protected form: CreateSchedulePayload = this.emptyForm();

  protected readonly days = [
    { key: 'saturday', label: 'Saturday' }, { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' }, { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' }, { key: 'thursday', label: 'Thursday' },
  ];

  constructor() { this.loadData(); }

  protected scheduleFor(day: string): ScheduleEntry[] {
    return this.schedules().filter((schedule) => schedule.day_of_week.toLowerCase() === day);
  }

  protected toggleForm(): void {
    this.showForm.update((visible) => !visible);
    this.error.set(''); this.success.set('');
  }

  protected loadData(): void {
    this.isLoading.set(true); this.error.set('');
    forkJoin({ schedules: this.schedulesService.getSchedules(), profile: this.authService.me() })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ schedules, profile }) => {
          this.schedules.set(schedules);
          this.profile = { department: this.idOf(profile.department), current_level: profile.current_level };
          this.subjects.set(profile.subjects ?? []);
          this.form = this.emptyForm();
        },
        error: () => this.error.set('Unable to load your schedule. Please try again.'),
      });
  }

  protected createSchedule(): void {
    if (this.isSubmitting()) return;
    this.error.set(''); this.success.set('');
    const payload: CreateSchedulePayload = { ...this.form, target_level: this.profile.current_level ?? this.form.target_level };
    if (this.profile.department) payload.department = this.profile.department;
    this.isSubmitting.set(true);
    this.schedulesService.createSchedule(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (schedule) => {
          this.schedules.update((items) => [...items, schedule]);
          this.form = this.emptyForm(); this.showForm.set(false);
          this.success.set('Schedule entry added successfully.');
        },
        error: (response) => this.error.set(this.apiError(response) || 'Could not add this schedule entry.'),
      });
  }

  protected formatTime(time: string): string {
    const [hour = '0', minute = '00'] = time.split(':');
    const value = Number(hour); const suffix = value >= 12 ? 'PM' : 'AM';
    return `${value % 12 || 12}:${minute} ${suffix}`;
  }

  private emptyForm(): CreateSchedulePayload {
    return { target_level: this.profile.current_level ?? 1, subject: '', doctor_name: '', type: 'Lecture', hall_location: '', day_of_week: 'saturday', start_time: '09:00', end_time: '10:00' };
  }

  private idOf(value: unknown): string | number | undefined {
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (value && typeof value === 'object') {
      const item = value as Record<string, unknown>;
      const id = item['department_id'] ?? item['id'];
      return typeof id === 'string' || typeof id === 'number' ? id : undefined;
    }
    return undefined;
  }

  private apiError(response: { error?: unknown }): string {
    const error = response.error;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') return Object.values(error as Record<string, unknown>).flat().join(' ');
    return '';
  }
}
