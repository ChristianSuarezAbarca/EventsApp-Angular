import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'confirm-delete',
	standalone: true,
	imports: [NgbModalModule],
	templateUrl: './confirm-delete.component.html',
	styleUrl: './confirm-delete.component.css'
})
export class ConfirmDeleteComponent {
	title = '';
	body = '';

	activeModal = inject(NgbActiveModal);
}
