import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../shared/interfaces/user';
import { AuthService } from '../../shared/services/auth.service';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { MyGeolocation } from '../../shared/services/my-geolocation';

@Component({
	selector: 'register',
	standalone: true,
	imports: [RouterLink, ReactiveFormsModule, ValidationClassesDirective, EncodeBase64Directive],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	#fb = inject(NonNullableFormBuilder);
	#authService = inject(AuthService);
	#router = inject(Router);
	
	registerForm = this.#fb.group({
		name: ['', [Validators.required]],
		password: ['', [Validators.required, Validators.minLength(4)]],
		avatar: ['', [Validators.required]],
		lat: [0, [Validators.required]],
		lng: [0, [Validators.required]],
		emailGroup: this.#fb.group(
			{
				email: ['', [Validators.required, Validators.email]],
				email2: ['', [Validators.required, Validators.email]],
			},
			{ validators: this.matchEmail }
		),
	});

	user: User = {
		name: '',
		email: '',
		avatar: '',
		lat: 1,
		lng: 1
	};
	
	async ngOnInit(){
		const location = await MyGeolocation.getLocation();
        const lat = location.latitude;
        const lng = location.longitude;
		this.registerForm.get('lat')?.setValue(lat);
		this.registerForm.get('lng')?.setValue(lng);
	}

	registerUser(): void {
		if (this.registerForm.valid) {
			this.#authService.register(this.user).subscribe(() => { this.#router.navigate(['/login']); });
		}
	}

	matchEmail(c: AbstractControl): ValidationErrors | null {
		const email = c.get('email')?.value;
		const email2 = c.get('email2')?.value;
		return email === email2 ? null : { match: true };
	}

	async createUser(encodedFile: string): Promise<void> {
		const avatar64 = encodedFile;
		const email = this.registerForm.get('emailGroup')!.get('email')!.value;
		this.user = {
			...this.registerForm.getRawValue(),
			email: email,
			avatar: avatar64,
		}
	}
}
