import { Component, DestroyRef, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Schedule, SchedulesService } from '../../../../core/services/schedules.service';

@Component({ selector: 'app-student-schedule', imports: [], templateUrl: './student-schedule.html', styleUrl: './student-schedule.css' })
export class StudentSchedule {
  private readonly schedulesApi = inject(SchedulesService); private readonly destroyRef = inject(DestroyRef);
  protected readonly schedules = signal<Schedule[]>([]); protected readonly isLoading = signal(true); protected readonly error = signal('');
  protected readonly days = [{ key: 'saturday', label: 'Saturday' }, { key: 'sunday', label: 'Sunday' }, { key: 'monday', label: 'Monday' }, { key: 'tuesday', label: 'Tuesday' }, { key: 'wednesday', label: 'Wednesday' }, { key: 'thursday', label: 'Thursday' }];
  constructor() { this.load(); }
  protected load(): void { this.isLoading.set(true); this.error.set(''); this.schedulesApi.getSchedules().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false))).subscribe({ next: (schedules) => this.schedules.set(schedules), error: () => this.error.set('Unable to load your schedule.') }); }
  protected forDay(day: string): Schedule[] { return this.schedules().filter((schedule) => schedule.day_of_week.toLowerCase() === day).sort((a,b) => a.start_time.localeCompare(b.start_time)); }
  protected formatTime(time: string): string { const [hour = '0', minute = '00'] = time.split(':'); const number = Number(hour); return `${number % 12 || 12}:${minute} ${number >= 12 ? 'PM' : 'AM'}`; }
}
