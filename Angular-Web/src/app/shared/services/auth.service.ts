import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterCredentials {
	full_name: string;
	department: string;
	current_level: number;
	username: string;
	email: string;
	password: string;
	invite_code?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly http = inject(HttpClient);

	login(credentials: LoginCredentials): Observable<any> {
		return this.http.post<any>(`${ environment.baseUrl }/login/`, credentials)
	}

	register(credentials: RegisterCredentials): Observable<any> {
		return this.http.post<any>(`${ environment.baseUrl }/register/`, credentials);
	}

	logout(): Observable<void> {
		return this.http.post<void>(`${ environment.baseUrl }/logout/`, {});
	}

	me(): Observable<any> {
		return this.http.get<any>(`${ environment.baseUrl }/me/`);
	}
}
