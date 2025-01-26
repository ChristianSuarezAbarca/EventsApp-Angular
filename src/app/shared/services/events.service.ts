import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EventsResponse, SingleEventResponse } from '../interfaces/responses';
import { MyEvent } from '../interfaces/myevent';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class EventsService {
	#url = 'events';
	#http = inject(HttpClient);

	getEvents(): Observable<MyEvent[]> {
		return this.#http.get<EventsResponse>(`${this.#url}`).pipe(map((resp) => resp.events));
	}

	getEvent(id: number): Observable<MyEvent> {
		return this.#http.get<SingleEventResponse>(`${this.#url}/${id}`).pipe(map((resp) => resp.event));
	}

	addEvent(event: MyEvent): Observable<MyEvent> {
		return this.#http.post<SingleEventResponse>(this.#url, event).pipe(map((resp) => resp.event));
	}

	deleteEvent(id: number): Observable<void> {
		return this.#http.delete<void>(`${this.#url}/${id}`);
	}

	attendEvent(id: number): Observable<number>{
		return this.#http.post<number>(`${this.#url}/${id}/attend`, id).pipe(map((resp) => resp));
	}

	deleteAttend(id: number): Observable<void>{
		return this.#http.delete<void>(`${this.#url}/${id}/attend`);
	}

	getAttendees(id: number): Observable<number>{
		return this.#http.get<number>(`${this.#url}/${id}/attend`).pipe(map((resp) => resp));
	}
}
