import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MyGeolocation } from '../../shared/services/my-geolocation';
import { UserLogin, UserLoginGoogle } from '../../shared/interfaces/user';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { GoogleLoginDirective } from '../../google-login/google-login.directive';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FbLoginDirective } from '../../facebook-login/fb-login.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
	selector: 'login',
	standalone: true,
	imports: [RouterLink, ValidationClassesDirective, ReactiveFormsModule, GoogleLoginDirective, FbLoginDirective, FontAwesomeModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	#fb = inject(NonNullableFormBuilder);
	#authService = inject(AuthService);
	#router = inject(Router);
	iconFacebook = faFacebook;

	user: UserLogin = {
		email: '',
		password: '',
		lat: 1,
		lng: 1
	};

	userGoogle: UserLoginGoogle = {
		token: '',
		lat: 1,
		lng: 1
	};

	loginForm = this.#fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required]]
	});

	async sendLogin(): Promise<void> {
		const location = await MyGeolocation.getLocation();
		const lat = location.latitude;
		const lng = location.longitude;

		this.user = {
			...this.loginForm.getRawValue(),
			lat: lat,
			lng: lng
		}

		if (this.loginForm.valid) {
			this.#authService.login(this.user).subscribe(() => { this.#router.navigate(['/events']); });
		}
	}

	async loggedGoogle(resp: google.accounts.id.CredentialResponse) {
		const location = await MyGeolocation.getLocation();
		const lat = location.latitude;
		const lng = location.longitude;

		this.userGoogle = {
			token: resp.credential,
			lat: lat,
			lng: lng
		}
		console.log(resp.credential);
		this.#authService.loginGoogle(this.userGoogle).subscribe(() => { this.#router.navigate(['/events']); });
	}

	loggedFacebook(resp: fb.StatusResponse) {
		// Envía esto a tu API
		console.log(resp.authResponse.accessToken);
	}

	showError(error: unknown) {
		console.error(error);
	}
}
