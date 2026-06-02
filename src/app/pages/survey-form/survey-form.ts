import { Component, inject, signal } from '@angular/core';
import { Logo } from "../../shared/logo/logo";
import { Router, RouterLink } from "@angular/router";
import { CancelButton } from "../../shared/buttons/cancel-button/cancel-button";
import { Status } from "../../shared/status/status";
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { Dropdown } from "../../shared/dropdown/dropdown";
import { ClearButton } from "../../shared/buttons/clear-button/clear-button";
import { Surveys } from '../../shared/service/surveys';
import { Surveymodel } from '../../shared/model/surveymodel';

@Component({
  selector: 'app-survey-form',
  imports: [Logo, RouterLink, CancelButton, Status, ReactiveFormsModule, Dropdown, ClearButton],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})
export class SurveyForm {
  formbuilder = inject(FormBuilder);
  showSuccessMessage = signal(false);
  maxAnswers = signal(false);
  router = inject(Router)
  surveyService = inject(Surveys);

  surveyForm = this.formbuilder.group({
    title: ['', [Validators.required]],
    description: [''],
    date: [''],
    category: ['', [Validators.required]],
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
      allowMultipleAnswers: [false],
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
    if (this.getAnswers(questionIndex).length > 5) {
      return
    }
    this.maxAnswers.set(true);
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

  getCategory(value: string) {
    this.surveyForm.controls['category'].setValue(value);
  }

  clearField(controlName: "title" | "description" | "date") {
    this.surveyForm.controls[controlName].setValue('');
  };

  get invalidTitle() {
    return !this.surveyForm.get('title')?.valid && this.surveyForm.get('title')?.touched;
  };

  invalidQuestion(index: number) {
    return !this.questions.at(index).get('question')?.valid && this.questions.at(index).get('question')?.touched;
  };

  invalidAnswer(questionIndex: number, answerIndex: number) {
    return !this.getAnswers(questionIndex).at(answerIndex).get('answer')?.valid && this.getAnswers(questionIndex).at(answerIndex).get('answer')?.touched
  };

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index);
  };

  formSubmit() {
    console.log(this.surveyForm.value);
    if (this.surveyForm.valid) {

    }
  };

    getSurvey() {
    
  }

}


