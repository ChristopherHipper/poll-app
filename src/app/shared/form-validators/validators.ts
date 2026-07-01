import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';


export function LessThanToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let today: Date = new Date();
        return new Date(control.value) <= today ? { lessThanToday: { value: control.value } } : null;
    };
}

export function forbiddenNameValidator(name:string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return control.value == name ? { forbiddenName: { value: control.value } } : null;
    };
}