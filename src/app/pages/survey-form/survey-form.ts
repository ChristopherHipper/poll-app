import { Component, computed, inject, signal } from '@angular/core';
import { Logo } from "../../shared/logo/logo";
import { RouterLink } from "@angular/router";
import { CancelButton } from "../../shared/buttons/cancel-button/cancel-button";
import { Status } from "../../shared/status/status";
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Dropdown } from "../../shared/dropdown/dropdown";
import { ClearButton } from "../../shared/buttons/clear-button/clear-button";
import { Question } from '../../shared/interface/question';

@Component({
  selector: 'app-survey-form',
  imports: [Logo, RouterLink, CancelButton, Status, ReactiveFormsModule, Dropdown, ClearButton],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})
export class SurveyForm {
  formbuilder = inject(FormBuilder);
  showSuccessMessage = signal(false);
  questions = signal<Question[]>([
    {
      id: 0,
      title: '',
    },
  ]);

  surveyForm = this.formbuilder.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', []],
    date: ['', []],
  });

  get invalidName() {
    return !this.surveyForm.get('name')?.valid && this.surveyForm.get('name')?.touched;
  };


  formSubmit() { }

  getCategory(value: string) { }

  clearField(controlName: keyof typeof this.surveyForm.controls) {
    this.surveyForm.controls[controlName].setValue('')
  }

  increaseQuestions() {

  }

  removeQuestion(questionIndex: number) {
    if (questionIndex == 0) {
      console.log('clear erste frage');

    } else {
      this.deleteQuestion(questionIndex)
      console.log('lösche frage an der stelle', questionIndex);
    }
  }

  deleteQuestion(index: number) {
    this.questions.update(questions => questions.filter(question => question.id === index));
  }

}


