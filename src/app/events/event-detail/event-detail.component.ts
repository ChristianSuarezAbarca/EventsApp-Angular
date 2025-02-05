import { ChangeDetectorRef, Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { Router } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/myevent';
import { Title } from '@angular/platform-browser';
import { OlMapDirective } from '../../shared/directives/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-marker.directive';
import { EventsService } from '../../shared/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../shared/interfaces/user';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'event-detail',
	standalone: true,
	imports: [EventCardComponent, OlMapDirective, OlMarkerDirective, FormsModule, ReactiveFormsModule],
	templateUrl: './event-detail.component.html',
	styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
	#fb = inject(NonNullableFormBuilder);
	#changeDetector = inject(ChangeDetectorRef);
	#eventsService = inject(EventsService);
	#destroyRef = inject(DestroyRef);
	#router = inject(Router);
	#title = inject(Title);
	event = input.required<MyEvent>();
	coordinates = signal<[number, number]>([0, 0]);
	usersAttend: User[] = [];
	comments:Comment[] = [];

	newCommentForm = this.#fb.group({
		comment: ['', [Validators.required]]
	});
	
	constructor() {
		effect(() => this.#title.setTitle(this.event().title));
	}

	ngOnInit() {
		this.coordinates.set([this.event().lng, this.event().lat]);

		this.#eventsService.getAttendees(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((numAttend) => {
            this.usersAttend = numAttend.users;
			console.log(this.usersAttend);
			this.#changeDetector.markForCheck();
        });

		this.#eventsService.getComments(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((comments) => {	
            this.comments = comments.comments;
			console.log(comments.comments);
			console.log(this.comments);
			this.#changeDetector.markForCheck();
        });
	}

	goBack() {
		this.#router.navigate(['/events']);
	}

	updateUsers(){
		this.#eventsService.getAttendees(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((numAttend) => {
            this.usersAttend = numAttend.users;
			this.#changeDetector.markForCheck();
        });
	}

	addComment(){
		console.log(this.newCommentForm.get('comment')!.value);
		this.#eventsService.postComment(this.event().id, this.newCommentForm.get('comment')!.value).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((comment) => {	
			console.log(comment);
			this.#changeDetector.markForCheck();
        });
		this.newCommentForm.reset();
	}
}
