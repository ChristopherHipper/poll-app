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
  selectedAnswers: {question :string,counter:number}[] = [];
  answeredAllQuestions = signal(false);


  ngOnInit() {
    const currentid = this.route.snapshot.paramMap.get('id');
    if (!currentid) return;
    this.surveyService.getSurveyById(+currentid);
  };

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index);
  };

  getPercentage(votes: number, answers: Answer[]): number {
    const percentage = 100 * votes / this.getAllVotes(answers);
    return Math.round(percentage);
  };

  getAllVotes(answers: Answer[]): number {
    let allVotes = 0;
    answers.forEach((a) => [
      allVotes += a.votes
    ]);
    return allVotes;
  };

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

  selectAnswer(input: HTMLInputElement) {
    const answer = this.selectedAnswers.find((a) => { return a.question == input.name })
    if (!answer) {
      this.selectedAnswers.push(
        { question: input.name, 
          counter: 1 
        })
    } else if (!input.checked && input.type === 'checkbox') {
      const index = this.selectedAnswers.indexOf(answer)
      if (index !== -1) {
        this.selectedAnswers[index].counter--;
        if (this.selectedAnswers[index].counter <= 0) {
          this.selectedAnswers.splice(index, 1);
        }
      }
    } else { answer.counter++ }
    this.checkBtnDisabled()
  }

  checkBtnDisabled() {
    if (this.selectedAnswers.length == this.singleSurvey().questions.length) {
      this.answeredAllQuestions.set(true)

    } else {
      this.answeredAllQuestions.set(false)
    }
  }

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
