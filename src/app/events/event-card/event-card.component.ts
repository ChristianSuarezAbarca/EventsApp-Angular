import { Component, DestroyRef, inject, input, output, OnInit, signal } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/myevent';
import { DatePipe } from '@angular/common';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { EventsService } from '../../shared/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../../shared/modals/confirm-delete/confirm-delete.component';

@Component({
	selector: 'event-card',
	standalone: true,
	imports: [DatePipe, IntlCurrencyPipe, RouterLink],
	templateUrl: './event-card.component.html',
	styleUrl: './event-card.component.css'
})
export class EventCardComponent implements OnInit {
	#eventsService = inject(EventsService);
	#destroyRef = inject(DestroyRef);
	#modalService = inject(NgbModal);
	event = input.required<MyEvent>();
	deleted = output<number>();
	going = signal("");
	thumb = signal("");
	color = signal("");
	numAttend = signal(0);
	users = output<void>();

	ngOnInit() {
		this.numAttend = signal(this.event().numAttend);

		if (this.event().attend) {
			this.going.set("I'm going");
			this.thumb.set("bi bi-hand-thumbs-up-fill");
			this.color.set("text-success text-end m-0 attend-button");
		} else {
			this.going.set("I'm not going");
			this.thumb.set("bi bi-hand-thumbs-down-fill");
			this.color.set("text-danger text-end m-0 attend-button");
		}
	}


	async deleteEvent(id: MyEvent['id']): Promise<void> {
		const confirmed = await this.openModal();
		if (confirmed) {
			this.#eventsService.deleteEvent(this.event().id!).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => this.deleted.emit(id!));
		}
	}

	openModal(): Promise<boolean> {
		const modalRef = this.#modalService.open(ConfirmDeleteComponent);
		modalRef.componentInstance.title = 'Are you sure?';
		modalRef.componentInstance.body = 'Do you want to delete this event?';
		return modalRef.result.catch(() => false);
	}

	attendEvent() {
		if (!this.event().attend) {
			this.#eventsService.attendEvent(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
				this.going.set("I'm going");
				this.thumb.set("bi bi-hand-thumbs-up-fill");
				this.color.set("text-success text-end m-0 attend-button");
				this.event().attend = !this.event().attend;
				this.uploadAttendNumber();
			});
		}
		else {
			this.#eventsService.deleteAttend(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
				this.going.set("I'm not going");
				this.thumb.set("bi bi-hand-thumbs-down-fill");
				this.color.set("text-danger text-end m-0 attend-button");
				this.event().attend = !this.event().attend;
				this.uploadAttendNumber();
			});
		}
	}

	uploadAttendNumber() {
		this.#eventsService.getAttendees(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((numAttend) => {
			this.numAttend.set(numAttend.users.length);
			this.users.emit();
		});
	}
}
