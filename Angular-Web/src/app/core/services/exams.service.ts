import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from './schedules.service';
import { environment } from '../../environment/environment';

export interface Exam {
  exam_id: string;
  target_level: number;
  department: string | number | null;
  subject: Subject;
  exam_date: string;
  start_time: string | null;
  end_time: string | null;
  hall_location: string | null;
  exam_type: 'midterm' | 'final' | 'quiz' | 'practical' | null;
}

export interface CreateExamPayload {
  target_level: number;
  department?: string | number;
  subject: string;
  exam_date: string;
  start_time?: string;
  end_time?: string;
  hall_location?: string;
  exam_type?: string;
}

@Injectable({ providedIn: 'root' })
export class ExamsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}/exams/`;
  getExams(): Observable<Exam[]> { return this.http.get<Exam[]>(this.endpoint); }
  createExam(payload: CreateExamPayload): Observable<Exam> { return this.http.post<Exam>(this.endpoint, payload); }
}
