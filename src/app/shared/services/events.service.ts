import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommentsResponse, EventsResponse, SingleEventResponse, UsersResponse } from '../interfaces/responses';
import { MyEvent } from '../interfaces/myevent';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class EventsService {
	#url = 'events';
	#http = inject(HttpClient);

	getEvents(params: URLSearchParams): Observable<EventsResponse> {
		return this.#http.get<EventsResponse>(`${this.#url}?${params.toString()}`).pipe(map((resp) => resp));
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

	attendEvent(id: number): Observable<boolean>{
		return this.#http.post<boolean>(`${this.#url}/${id}/attend`, null).pipe(map((resp) => resp));
	}

	deleteAttend(id: number): Observable<boolean>{
		return this.#http.delete<boolean>(`${this.#url}/${id}/attend`).pipe(map((resp) => resp));
	}

	getAttendees(id: number): Observable<UsersResponse>{
		return this.#http.get<UsersResponse>(`${this.#url}/${id}/attend`).pipe(map((resp) =>{ return resp }));
	}

	getComments(eventId: number): Observable<CommentsResponse> {
        return this.#http
            .get<CommentsResponse>(`${this.#url}/${eventId}/comments`)
            .pipe(map((resp) =>{ return resp }));
    }

    postComment(id: number, comment: string): Observable<Comment> {
        return this.#http.post<Comment>(`${this.#url}/${id}/comments`, comment);
    }
}
