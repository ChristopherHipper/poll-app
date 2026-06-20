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
  router = inject(Router);
  surveyService = inject(Surveys);

  surveyForm = this.formbuilder.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    end_date: [''],
    category: ['', [Validators.required]],
    questions: this.formbuilder.array([
      this.createQuestion()
    ])
  });

  /**
 * Gets the FormArray of questions from the survey form.
 *
 * @returns The questions FormArray.
 */
  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  };

  /**
 * Returns the answers FormArray for a specific question.
 *
 * @param questionIndex - The index of the question.
 * @returns The FormArray containing answers.
 */
  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  };

  /**
 * Creates a new question FormGroup with default values.
 *
 * @returns A FormGroup representing a survey question.
 */
  createQuestion(): FormGroup {
    return this.formbuilder.group({
      question: ['', [Validators.required]],
      allowMultipleAnswers: [false],
      answers: this.formbuilder.array([
        this.createAnswer(),
        this.createAnswer()
      ])
    });
  };

  /**
 * Creates a new answer FormGroup with default values.
 *
 * @returns A FormGroup representing a survey answer.
 */
  createAnswer(): FormGroup {
    return this.formbuilder.group({
      answer: ['', { nonNullable: true, validators: [Validators.required] }]
    });
  };

  /**
 * Adds a new answer to a question if the maximum limit is not reached.
 *
 * @param questionIndex - The index of the question.
 */
  addAnswer(questionIndex: number) {
    if (this.getAnswers(questionIndex).length > 5) {
      return
    };
    this.maxAnswers.set(true);
    this.getAnswers(questionIndex).push(this.createAnswer());
  };

  /**
 * Adds a new question to the survey form.
 */
  addQuestion() {
    this.questions.push(this.createQuestion());
  };

  /**
 * Removes a question from the survey form.
 * If only one question remains, it is cleared instead of removed.
 *
 * @param index - The index of the question to remove.
 */
  removeQuestion(index: number) {
    if (this.questions.length == 1) {
      this.clearQuestion(index);
      return;
    };
    this.questions.removeAt(index);
  };

  /**
 * Removes an answer from a question.
 * If only one answer remains, it is cleared instead of removed.
 *
 * @param questionIndex - The index of the question.
 * @param answerIndex - The index of the answer to remove.
 */
  removeAnswer(questionIndex: number, answerIndex: number) {
    if (this.getAnswers(questionIndex).length == 1) {
      this.clearAnswer(questionIndex, answerIndex);
      return;
    };
    this.getAnswers(questionIndex).removeAt(answerIndex);
  };

  /**
 * Clears the question text at the given index.
 *
 * @param index - The index of the question to clear.
 */
  clearQuestion(index: number) {
    this.questions.at(index).get('question')?.setValue('');
  };

  /**
 * Clears the answer text at the given question and answer index.
 *
 * @param questionIndex - The index of the question.
 * @param answerIndex - The index of the answer to clear.
 */
  clearAnswer(questionIndex: number, answerIndex: number) {
    this.getAnswers(questionIndex).at(answerIndex).get('answer')?.setValue('');
  };

  /**
 * Sets the selected category value in the survey form.
 *
 * @param value - The category to set.
 */
  getCategory(value: string) {
    this.surveyForm.controls['category'].setValue(value);
  };

  /**
 * Clears the value of a specified form control.
 *
 * @param controlName - The name of the control to clear.
 */
  clearField(controlName: "title" | "description" | "end_date") {
    this.surveyForm.controls[controlName].setValue('');
  };

  /**
 * Indicates whether the survey title field is invalid and has been touched.
 *
 * @returns True if the title is invalid and touched, otherwise false.
 */
  get invalidTitle() {
    return !this.surveyForm.get('title')?.valid && this.surveyForm.get('title')?.touched;
  };

  /**
 * Checks whether a question is invalid and has been touched.
 *
 * @param index - The index of the question.
 * @returns True if the question is invalid and touched, otherwise false.
 */
  invalidQuestion(index: number) {
    return !this.questions.at(index).get('question')?.valid && this.questions.at(index).get('question')?.touched;
  };

  /**
 * Checks whether an answer is invalid and has been touched.
 *
 * @param questionIndex - The index of the question.
 * @param answerIndex - The index of the answer.
 * @returns True if the answer is invalid and touched, otherwise false.
 */
  invalidAnswer(questionIndex: number, answerIndex: number) {
    return !this.getAnswers(questionIndex).at(answerIndex).get('answer')?.valid && this.getAnswers(questionIndex).at(answerIndex).get('answer')?.touched
  };

  /**
 * Converts an answer index into an alphabetical label (A, B, C, ...).
 *
 * @param index - The zero-based answer index.
 * @returns The corresponding uppercase letter label.
 */
  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index);
  };

  /**
 * Submits the survey form if valid, saves the survey, and redirects after success.
 */
  formSubmit() {
    if (this.surveyForm.valid) {
      this.surveyService.addSurvey(this.getSurvey())
      this.surveyForm.reset();
      this.showSuccessMessage.set(true);
      setTimeout(() => {
        this.showSuccessMessage.set(false);
        this.router.navigate(['']);
      }, 2000);
    };
  };

  /**
 * Creates a SurveyModel instance from the current form value.
 *
 * @returns A new survey model based on the form data.
 */
  getSurvey() {
    return new Surveymodel(this.surveyForm.value);
  };

}


