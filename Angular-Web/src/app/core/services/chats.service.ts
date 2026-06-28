import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

/** API representation returned by the cohort chat endpoint. */
export interface Chat {
  message_id: string;
  sender_name: string;
  department: string | number;
  target_level: number;
  content: string;
  created_at: string;
}

export interface CreateChatPayload {
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.baseUrl}/chats/`;

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.endpoint);
  }

  createChat(payload: CreateChatPayload): Observable<Chat> {
    return this.http.post<Chat>(this.endpoint, payload);
  }
}
