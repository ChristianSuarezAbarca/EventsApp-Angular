import { Component, effect, inject, input } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { Router } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/myevent';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'event-detail',
	standalone: true,
	imports: [EventCardComponent],
	templateUrl: './event-detail.component.html',
	styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {
	#router = inject(Router);
	#title = inject(Title);
	event = input.required<MyEvent>();

	constructor() {
		effect(() =>this.#title.setTitle(this.event().title));
	}

	goBack() {
		this.#router.navigate(['/events']);
	}
}
