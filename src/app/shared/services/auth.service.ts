import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { SingleUserResponse, TokenResponse } from '../interfaces/responses';
import { HttpClient } from '@angular/common/http';
import { User, UserLogin, UserLoginGoogle } from '../interfaces/user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	#url = 'auth';
	#http = inject(HttpClient);
	#logged = signal(false);

	getLogged(): boolean{
		return this.#logged();
	}

	register(user: User): Observable<User> {
		return this.#http.post<SingleUserResponse>(this.#url + '/register', user).pipe(map((resp) => resp.user));
	}

	login(data: UserLogin): Observable<void> {
		return this.#http.post<TokenResponse>(this.#url + '/login', data).pipe(map((resp) => localStorage.setItem("token", resp.accessToken), this.#logged.set(true)));
	}

	loginGoogle(data: UserLoginGoogle): Observable<void>{
		return this.#http.post<TokenResponse>(this.#url + '/google', data).pipe(map((resp) => localStorage.setItem("token", resp.accessToken), this.#logged.set(true)));
	}

	logout(): void {
		localStorage.removeItem("token");
		this.#logged.set(false);
	}

	isLogged(): Observable<boolean> {
		const token = localStorage.getItem('token');

		if (!this.#logged() && !token) {
			return of(false);
		}

		if (this.#logged()) {
			return of(true);
		}

		if (token) {
			return this.#http.get<boolean>(this.#url + '/validate').pipe(map(() => {this.#logged.set(true); return true;}),
				catchError(() => {
					localStorage.removeItem('token');
					this.#logged.set(false);
					return of(false);
				})
			);
		}

		return of(false);
	}
}
