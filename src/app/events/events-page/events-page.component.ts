import { Component, computed, inject, signal } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/myevent';
import { FormsModule } from '@angular/forms';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../../shared/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'events-page',
	standalone: true,
	imports: [FormsModule, EventCardComponent],
	templateUrl: './events-page.component.html',
	styleUrl: './events-page.component.css',
})

export class EventsPageComponent {
	#eventsService = inject(EventsService)
	search = signal("");
	events = signal<MyEvent[]>([]);
	newEvents = computed(() => {
		const searchValue = this.search().toLowerCase().trim();

		if (!searchValue) {
			return this.events();
		}

		return this.events().filter(event => event.title.toLowerCase().includes(searchValue) || event.description.toLowerCase().includes(searchValue));
	});

	constructor(){
		this.#eventsService.getEvents().pipe(takeUntilDestroyed()).subscribe((events) => this.events.set(events));
	}

	deleteEvent(id: MyEvent['id']): void {
		this.events.set(this.events().filter(event => event.id !== id));
	}

	orderByDate(): void {
		const orderedByDate = this.events().toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		this.events.set(orderedByDate);
	}

	orderByPrice(): void{
		const orderedByprice = this.events().toSorted((a, b) => a.price - b.price);
		this.events.set(orderedByprice);
	}
}
