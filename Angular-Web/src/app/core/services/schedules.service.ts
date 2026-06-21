import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface Subject {
  subject_id: string;
  subject_code: string;
  name: string;
  credits?: number;
}

export interface Schedule {
  schedule_id: string;
  target_level: number;
  department: string | number | null;
  doctor_name: string | null;
  subject: Subject;
  type: string;
  hall_location: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface CreateSchedulePayload {
  target_level: number;
  department?: string | number;
  doctor_name?: string;
  subject: string;
  type: string;
  hall_location: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}/schedules/`;

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.endpoint);
  }

  createSchedule(payload: CreateSchedulePayload): Observable<Schedule> {
    return this.http.post<Schedule>(this.endpoint, payload);
  }
}
