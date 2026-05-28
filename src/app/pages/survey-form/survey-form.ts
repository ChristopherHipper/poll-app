import { Component, inject, signal } from '@angular/core';
import { Logo } from "../../shared/logo/logo";
import { RouterLink } from "@angular/router";
import { CancelButton } from "../../shared/buttons/cancel-button/cancel-button";
import { Status } from "../../shared/status/status";
import { FormBuilder, Validators , ReactiveFormsModule} from '@angular/forms';
import { Dropdown } from "../../shared/dropdown/dropdown";

@Component({
  selector: 'app-survey-form',
  imports: [Logo, RouterLink, CancelButton, Status, ReactiveFormsModule, Dropdown],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})
export class SurveyForm {
  formbuilder = inject(FormBuilder);
  showSuccessMessage = signal(false);

  surveyForm = this.formbuilder.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    message: ['', []],
    date: ['', []],
  });

  get invalidName() {
    return !this.surveyForm.get('name')?.valid && this.surveyForm.get('name')?.touched;
  };


  formSubmit() { }

  getCategory(value: string){}

}
