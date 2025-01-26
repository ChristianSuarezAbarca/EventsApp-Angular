import { Component, DestroyRef, inject } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/myevent';
import { FormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { EventsService } from '../../shared/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';

@Component({
	selector: 'event-form',
	standalone: true,
	imports: [FormsModule, EncodeBase64Directive],
	templateUrl: './event-form.component.html',
	styleUrl: './event-form.component.css',
})
export class EventFormComponent implements CanComponentDeactivate {
	#eventsService = inject(EventsService);
	#destroyRef = inject(DestroyRef);
	#router = inject(Router);
	saved = false;
	newEvent: MyEvent = {
		title: '',
		description: '',
		price: 0,
		image: '',
		date: '',
		numAttend: 0,
		creator: {
			name: "",
			email: "",
			password: "",
			lat: 0,
			lng: 0,
			avatar: ""
		},
		attend: false,
		mine: true,
		address: '',
		id: 0,
		distance: 0,
		lat: 0,
		lng: 0
	};

	createEvent(): void {
		this.#eventsService.addEvent(this.newEvent).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
			this.saved = true;
			this.newEvent.image = '';
			this.#router.navigate(['/events']);
		});
	}

	canDeactivate() {
		return this.saved || confirm('Do you want to leave the page? The changes will be lost...');
	}
}
