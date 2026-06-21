import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../shared/services/auth.service';
import { SchedulesService, Schedule } from '../../../../core/services/schedules.service';
import { ExamsService, Exam } from '../../../../core/services/exams.service';
import { TodosService, Todo } from '../../../../core/services/todos.service';

@Component({
    selector: 'app-student-dashboard',
    imports: [DatePipe],
    templateUrl: './student-dashboard.html',
    styleUrl: './student-dashboard.css',
})
export class StudentDashboard {
    private readonly auth = inject(AuthService);
    private readonly schedulesApi = inject(SchedulesService);
    private readonly examsApi = inject(ExamsService);
    private readonly todosApi = inject(TodosService);
    private readonly destroyRef = inject(DestroyRef);
    protected readonly profile = signal<any | null>(null);
    protected readonly schedules = signal<Schedule[]>([]);
    protected readonly exams = signal<Exam[]>([]);
    protected readonly todos = signal<Todo[]>([]);
    protected readonly hasSchedulesData = signal(false);
    protected readonly hasExamsData = signal(false);
    protected readonly hasTodosData = signal(false);
    protected readonly unavailableSources = signal<string[]>([]);
    protected readonly now = new Date();
    protected readonly nextLecture = computed(
        () =>
            this.schedules()
                .slice()
                .sort((a, b) => a.start_time.localeCompare(b.start_time))[0] ?? null,
    );
    protected readonly isLoading = signal(true);
    protected readonly error = signal('');
    constructor() {
        this.load();
    }
    protected load(): void {
        this.isLoading.set(true);
        this.error.set('');
        this.unavailableSources.set([]);
        forkJoin({
            profile: this.auth.me(),
            schedules: this.schedulesApi
                .getSchedules()
                .pipe(catchError(() => this.unavailable('Schedule'))),
            exams: this.examsApi.getExams().pipe(catchError(() => this.unavailable('Exams'))),
            todos: this.todosApi.getTodos().pipe(catchError(() => this.unavailable('Tasks'))),
        })
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.isLoading.set(false)),
            )
            .subscribe({
                next: (data) => {
                    this.profile.set(data.profile);
                    this.hasSchedulesData.set(data.schedules !== null);
                    this.hasExamsData.set(data.exams !== null);
                    this.hasTodosData.set(data.todos !== null);
                    this.schedules.set(
                        (data.schedules ?? []).filter(
                            (item) => item.day_of_week.toLowerCase() === this.today(),
                        ),
                    );
                    this.exams.set(
                        (data.exams ?? [])
                            .filter((item) => new Date(item.exam_date) >= this.startOfToday())
                            .sort((a, b) => a.exam_date.localeCompare(b.exam_date)),
                    );
                    this.todos.set(data.todos ?? []);
                },
                error: () => this.error.set('Unable to load your profile data.'),
            });
    }
    protected formatTime(time: string): string {
        const [hour = '0', minute = '00'] = time.split(':');
        const number = Number(hour);
        return `${number % 12 || 12}:${minute} ${number >= 12 ? 'PM' : 'AM'}`;
    }
    private unavailable(source: string) {
        this.unavailableSources.update((sources) => [...sources, source]);
        return of(null);
    }
    private today(): string {
        return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
            new Date().getDay()
        ];
    }
    private startOfToday(): Date {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }
}
