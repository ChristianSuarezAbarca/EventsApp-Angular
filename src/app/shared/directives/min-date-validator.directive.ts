import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';


@Directive({
	selector: '[minDateValidator]',
	standalone: true
})
export class MinDateValidatorDirective {
	minDateValidator(minDate: string): ValidatorFn {
		return (c: AbstractControl): ValidationErrors | null => {
			if (c.value && minDate && minDate > c.value) {
				return { minDate: true };
			}
			return null;
		};
	}
}
