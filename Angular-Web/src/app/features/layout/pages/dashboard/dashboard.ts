import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatsService, Chat } from '../../../../core/services/chats.service';
import { SchedulesService, Schedule } from '../../../../core/services/schedules.service';
import { StudentsService } from '../../../../core/services/students.service';

@Component({
    selector: 'app-dashboard',
    imports: [DatePipe, RouterLink],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly studentsService = inject(StudentsService);
  private readonly schedulesService = inject(SchedulesService);
  private readonly chatsService = inject(ChatsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly studentsCount = signal(0);
  protected readonly schedulesCount = signal(0);
  protected readonly announcements = signal<Chat[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly error = signal('');

  constructor() { this.loadDashboard(); }

  protected loadDashboard(): void {
    this.isLoading.set(true); this.error.set('');
    forkJoin({
      students: this.studentsService.getStudents(),
      schedules: this.schedulesService.getSchedules(),
      chats: this.chatsService.getChats(),
    }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ students, schedules, chats }) => {
          this.studentsCount.set(students.length);
          this.schedulesCount.set(schedules.length);
          this.announcements.set(chats);
        },
        error: () => this.error.set('Unable to load dashboard data. Please refresh and try again.'),
      });
  }

  protected scheduleLabel(schedule: Schedule): string {
    return `${schedule.subject?.name ?? 'Class'} · ${schedule.day_of_week}`;
  }
}
