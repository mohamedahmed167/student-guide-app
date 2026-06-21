import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface Todo { todo_id: string; task_name: string; is_completed: boolean; }

@Injectable({ providedIn: 'root' })
export class TodosService {
  private readonly http = inject(HttpClient);
  getTodos(): Observable<Todo[]> { return this.http.get<Todo[]>(`${environment.baseUrl}/todos/`); }
}
