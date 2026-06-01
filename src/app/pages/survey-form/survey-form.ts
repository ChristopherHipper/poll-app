import { Component, inject, signal } from '@angular/core';
import { Logo } from "../../shared/logo/logo";
import { RouterLink } from "@angular/router";
import { CancelButton } from "../../shared/buttons/cancel-button/cancel-button";
import { Status } from "../../shared/status/status";
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { Dropdown } from "../../shared/dropdown/dropdown";
import { ClearButton } from "../../shared/buttons/clear-button/clear-button";

@Component({
  selector: 'app-survey-form',
  imports: [Logo, RouterLink, CancelButton, Status, ReactiveFormsModule, Dropdown, ClearButton],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})
export class SurveyForm {
  formbuilder = inject(FormBuilder);
  showSuccessMessage = signal(false);

  surveyForm = this.formbuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    date: [''],
    questions: this.formbuilder.array([
      this.createQuestion()
    ])
  });

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  };

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  };

  createQuestion(): FormGroup {
    return this.formbuilder.group({
      question: ['', Validators.required],
      answers: this.formbuilder.array([
        this.createAnswer(),
        this.createAnswer()
      ])
    });
  };

  createAnswer(): FormGroup {
    return this.formbuilder.group({
      answer: ['', Validators.required]
    });
  };

  addAnswer(questionIndex: number) {
    this.getAnswers(questionIndex).push(this.createAnswer());
  };

  addQuestion() {
    this.questions.push(this.createQuestion());
  };

  removeQuestion(index: number) {
    if (this.questions.length == 1) {
      this.clearQuestion(index);
      return;
    };
    this.questions.removeAt(index);
  };

  removeAnswer(questionIndex: number, answerIndex: number) {
    if (this.getAnswers(questionIndex).length == 1) {
      this.clearAnswer(questionIndex, answerIndex);
      return;
    };
    this.getAnswers(questionIndex).removeAt(answerIndex);
  };

  clearQuestion(index: number) {
    this.questions.at(index).get('question')?.setValue('');
  };

  clearAnswer(questionIndex: number, answerIndex: number) {
    this.getAnswers(questionIndex).at(answerIndex).get('answer')?.setValue('');
  };


  formSubmit() { };

  getCategory(value: string) { }

  clearField(controlName: "name" | "description" | "date") {
    this.surveyForm.controls[controlName].setValue('');
  };

  get invalidName() {
    return !this.surveyForm.get('name')?.valid && this.surveyForm.get('name')?.touched;
  };

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index);
  };

}


