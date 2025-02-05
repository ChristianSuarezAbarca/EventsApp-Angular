import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/myevent';
import { FormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { EventsService } from '../../shared/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { OlMapDirective } from '../../shared/directives/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-marker.directive';
import { SearchResult } from '../../shared/interfaces/search-result';
import { GaAutocompleteDirective } from '../../shared/directives/ga-autocomplete.directive';
import { MyGeolocation } from '../../shared/services/my-geolocation';

@Component({
	selector: 'event-form',
	standalone: true,
	imports: [FormsModule, EncodeBase64Directive, OlMapDirective, OlMarkerDirective, GaAutocompleteDirective],
	templateUrl: './event-form.component.html',
	styleUrl: './event-form.component.css'
})
export class EventFormComponent implements CanComponentDeactivate, OnInit {
	#eventsService = inject(EventsService);
	#destroyRef = inject(DestroyRef);
	#router = inject(Router);
	saved = false;
	coordinates = signal<[number, number]>([0, 0]);

	newEvent: MyEvent = {
		title: '',
		description: '',
		price: 0,
		image: '',
		date: '',
		numAttend: 0,
		attend: false,
		mine: true,
		address: '',
		id: 0,
		distance: 0,
		lat: 0,
		lng: 0,
		creator: {
			name: "",
			email: "",
			password: "",
			lat: 0,
			lng: 0,
			avatar: ""
		}
	};

	async ngOnInit() {
		const location = await MyGeolocation.getLocation();
		const lat = location.latitude;
		const lng = location.longitude;
		this.newEvent.lng = lng;
		this.newEvent.lat = lat;
		this.coordinates.set([lng, lat]);
	}

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

	async changePlace(result: SearchResult) {
		this.coordinates.set(result.coordinates);
		this.newEvent.address = result.address;
		this.newEvent.lng = result.coordinates[0];
		this.newEvent.lat = result.coordinates[1];
	}
}
