import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface Student {
  student_id: string;
  full_name: string;
  current_level: number;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private readonly http = inject(HttpClient);

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.baseUrl}/students/`);
  }
}
