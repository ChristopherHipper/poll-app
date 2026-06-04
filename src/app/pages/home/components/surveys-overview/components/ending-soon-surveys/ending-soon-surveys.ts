import { Component, inject, signal } from '@angular/core';
import { Surveys } from '../../../../../../shared/service/surveys';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-ending-soon-surveys',
  imports: [RouterLink],
  templateUrl: './ending-soon-surveys.html',
  styleUrl: './ending-soon-surveys.scss',
})
export class EndingSoonSurveys {
  surveyService = inject(Surveys);
  restDays = signal(0);

  surveys = this.surveyService.surveys;

  getDay(days:number){
    if (days > 1) {
      return ' days';
    } else {
      return ' day';
    };
  };
};
