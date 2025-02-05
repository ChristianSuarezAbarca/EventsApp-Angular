import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'top-menu',
	standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './top-menu.component.html',
    styleUrl: './top-menu.component.css'
})
export class TopMenuComponent {
	#authService = inject(AuthService);
	#router = inject(Router);

	isLogged = computed<boolean>(() => this.#authService.getLogged());

	logout(){
		this.#authService.logout();
		this.#router.navigate(['/login']);
	}
}
