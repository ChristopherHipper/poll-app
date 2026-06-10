import { Component, inject, signal } from '@angular/core';
import { Logo } from "../../shared/logo/logo";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Status } from "../../shared/status/status";
import { Surveys } from '../../shared/service/surveys';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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

  updateSurvey() {
    console.log('update');
  };

}
