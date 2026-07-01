import { Component, inject, input, signal } from '@angular/core';
import { Logo } from "../../shared/logo/logo";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Status } from "../../shared/status/status";
import { Surveys } from '../../shared/service/surveys';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { Answer } from '../../shared/interface/answer';

@Component({
  selector: 'app-survey-detail',
  imports: [Logo, RouterLink, Status, DatePipe, ReactiveFormsModule],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  router = inject(Router);
  private route = inject(ActivatedRoute);
  surveyService = inject(Surveys);
  singleSurvey = this.surveyService.singleSurvey;
  currentAnswerId = signal(0);
  showResults = signal(true);
  surveyResultState = signal('Close');
  arrowImg = signal('arrow_up');
  showSuccessMessage = signal(false);
  selectedAnswers: { question: string, counter: number }[] = [];
  answeredAllQuestions = signal(false);

  /**
   * Initializes the component and loads the survey based on the route parameter.
   */
  ngOnInit() {
    const currentid = this.route.snapshot.paramMap.get('id');
    if (!currentid) return;
    this.surveyService.getSurveyById(+currentid);
    console.log(this.singleSurvey());
    
  };

  /**
 * Returns the alphabetical label for the given answer index.
 *
 * @param index - The answer index.
 * @returns The corresponding uppercase letter.
 */
  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index);
  };

  /**
 * Calculates the percentage of votes for an answer.
 *
 * @param votes - The number of votes for the answer.
 * @param answers - The list of all answers.
 * @returns The rounded percentage of votes.
 */
  getPercentage(votes: number, answers: Answer[]): number {
    const percentage = 100 * votes / this.getAllVotes(answers);
    if (percentage) {
      return Math.round(percentage);
    } else {
      return 0
    }
    
  };

  /**
 * Calculates the total number of votes for all answers.
 *
 * @param answers - The list of answers.
 * @returns The total number of votes.
 */
  getAllVotes(answers: Answer[]): number {
    let allVotes = 0;
    answers.forEach((a) => [
      allVotes += a.votes
    ]);
    return allVotes;
  };

  /**
 * Updates the vote count based on the selected answer.
 *
 * @param event - The input change event.
 * @param answer - The selected answer.
 * @param answers - The list of all answers.
 */
  updateVotes(event: Event, answer: Answer, answers: Answer[]) {
    const input = (event.target as HTMLInputElement)
    this.selectAnswer(input)
    if (input.type == 'checkbox') {
      answer.votes += input.checked ? 1 : -1;
      return;
    } else {
      if (answer.id != this.currentAnswerId()) {
        answer.votes++;
        answers.forEach((a) => {
          if (a.id === this.currentAnswerId()) {
            a.votes--
          };
        });
        this.currentAnswerId.set(answer.id);
      };
    };
  };

  /**
   * Updates the selected answers based on the input state.
   *
   * @param input - The selected input element.
   */
  selectAnswer(input: HTMLInputElement) {
    const answer = this.selectedAnswers.find((a) => { return a.question == input.name })
    if (!answer) {
      this.selectedAnswers.push(
        {
          question: input.name,
          counter: 1
        });
    } else if (!input.checked && input.type === 'checkbox') {
      const index = this.selectedAnswers.indexOf(answer);
      if (index !== -1) {
        this.selectedAnswers[index].counter--;
        if (this.selectedAnswers[index].counter <= 0) {
          this.selectedAnswers.splice(index, 1);
        };
      };
    } else { answer.counter++ };
    this.checkBtnDisabled();
  };

  /**
 * Checks whether all questions have been answered.
 */
  checkBtnDisabled() {
    if (this.selectedAnswers.length == this.singleSurvey().questions.length) {
      this.answeredAllQuestions.set(true);
    } else {
      this.answeredAllQuestions.set(false);
    };
  };

  /**
 * Updates the survey votes and navigates back after a success message.
 */
  updateSurveyVotes() {
    const questions = this.singleSurvey().questions;
    for (const question of questions) {
      for (const answer of question.answers) {
        this.surveyService.editSurveyVotes(answer.votes, answer.id);
      };
    };
    this.showSuccessMessage.set(true);
    setTimeout(() => {
      this.showSuccessMessage.set(false);
      this.router.navigate(['']);
    }, 2000);
  };

  /**
 * Toggles the visibility of survey results and updates UI state accordingly.
 */
  toggleSurveyResults() {
    this.showResults.set(!this.showResults())
    if (this.showResults()) {
      this.surveyResultState.set('Close');
      this.arrowImg.set('arrow_up');
    } else {
      this.surveyResultState.set('See');
      this.arrowImg.set('arrow_down');
    };
  };

}
