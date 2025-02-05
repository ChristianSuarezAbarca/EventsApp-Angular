import { ChangeDetectorRef, Component, inject, OnDestroy, signal } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/myevent';
import { FormsModule } from '@angular/forms';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../../shared/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

@Component({
    selector: 'events-page',
	standalone: true,
    imports: [FormsModule, EventCardComponent],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css'
})

export class EventsPageComponent implements OnDestroy {
	#eventsService = inject(EventsService)
	search = signal("");
	orderedBy = '';
	page = 1;
	events = signal<MyEvent[]>([]);
	#eventsSubscription: Subscription = new Subscription();
	#changeDetector = inject(ChangeDetectorRef);

	constructor(){
		const params = new URLSearchParams({ page: String(this.page), orderedBy: this.orderedBy, search: this.search() });
		this.#eventsService.getEvents(params).pipe(takeUntilDestroyed()).subscribe((events) => this.events.set(events.events));
	}

	deleteEvent(id: MyEvent['id']): void {
		this.events.set(this.events().filter(event => event.id !== id));
	}

	order(orderBy: string, moreEvents: boolean): void{
		this.orderedBy = orderBy;
		
		if(moreEvents){
			this.page++;
			const params = new URLSearchParams({ page: String(this.page), order: orderBy, search: this.search() });
			const subscription = this.#eventsService.getEvents(params).subscribe((events) => {
				if(events.more){
					this.events().push(...events.events);
				}
				else{
					document.getElementById("loadMore")!.className = events.more ? "btn btn-primary" : "btn btn-primary d-none";
				}
				this.#changeDetector.markForCheck();
			});
			this.#eventsSubscription.add(subscription);
		}
		else{
			const params = new URLSearchParams({ page: String(this.page), order: orderBy, search: this.search() });
			const subscription = this.#eventsService.getEvents(params).subscribe((events) => {
				this.events.set(events.events);
			});
			this.#eventsSubscription.add(subscription);
		}
	}

	ngOnDestroy(): void {
        this.#eventsSubscription.unsubscribe();
    }
}
