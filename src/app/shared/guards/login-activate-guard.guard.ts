import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const loginActivateGuard: CanActivateFn = () => {
	const authService = inject(AuthService);
	const router = inject(Router);

	return authService.isLogged().pipe(map((isLogged) => {
			if (!isLogged) {
				return router.createUrlTree(['/login']);
			}
			return true;
		})
	);
};
