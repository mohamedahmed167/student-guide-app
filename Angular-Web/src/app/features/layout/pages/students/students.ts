import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Student, StudentsService } from '../../../../core/services/students.service';

@Component({
    selector: 'app-students',
    imports: [FormsModule],
    templateUrl: './students.html',
    styleUrl: './students.css',
})
export class Students {
  private readonly studentsService = inject(StudentsService); private readonly destroyRef = inject(DestroyRef);
  protected readonly students = signal<Student[]>([]); protected readonly isLoading = signal(true); protected readonly error = signal(''); protected search = '';
  constructor() { this.load(); }
  protected load(): void { this.isLoading.set(true); this.error.set(''); this.studentsService.getStudents().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false))).subscribe({ next: (students) => this.students.set(students), error: () => this.error.set('Unable to load students.') }); }
  protected filtered(): Student[] { const term = this.search.trim().toLowerCase(); return term ? this.students().filter((student) => `${student.full_name} ${student.student_id} ${student.role}`.toLowerCase().includes(term)) : this.students(); }
}
