import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/myevent';
import { DatePipe } from '@angular/common';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { EventsService } from '../../shared/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'event-card',
	standalone: true,
	imports: [DatePipe, IntlCurrencyPipe, RouterLink],
	templateUrl: './event-card.component.html',
	styleUrl: './event-card.component.css'
})
export class EventCardComponent {
	#eventsService = inject(EventsService);
	#destroyRef = inject(DestroyRef);
	event = input.required<MyEvent>();
	deleted = output<number>();
	going = "I'm not going"
	thumbClass = "bi bi-hand-thumbs-down-fill";

	deleteEvent(id: MyEvent['id']): void {
		this.#eventsService.deleteEvent(this.event().id!).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => this.deleted.emit(id!));
	}

	attendEvent(id: number){
		this.#eventsService.attendEvent(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => { 
			this.going = "I'm going";
			this.thumbClass = "bi bi-hand-thumbs-up-fill";
		});
	}
}
