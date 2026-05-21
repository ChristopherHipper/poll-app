import { Component, computed, inject, signal } from '@angular/core';
import { Surveys } from '../../../../../../shared/service/surveys';
import { Survey } from '../../../../../../shared/interface/survey';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-ending-soon-surveys',
  imports: [RouterLink],
  templateUrl: './ending-soon-surveys.html',
  styleUrl: './ending-soon-surveys.scss',
})
export class EndingSoonSurveys {
  surveyService = inject(Surveys)
  restDays = signal(0)

  surveys = this.surveyService.surveyList;
  endingSoonSurveys = computed(() => this.surveys().filter(survey => {
    return this.isEndingSoon(survey);
  })
  );

  isEndingSoon(survey: Survey): boolean {
    if (this.getRestDays(survey.end_date) < 10 && this.getRestDays(survey.end_date) > 0) {
      return true;
    } else {
      return false;
    };
  };

  getRestDays(date: Date) {
    const targetDate = new Date(date);
    const dayDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffInMilliseconds = targetDate.getTime() - dayDate.getTime();
    const restDays = Math.round(diffInMilliseconds / oneDay);
    if (restDays <= 1) {
      return restDays;
    } else {
      return restDays;
    };
  };

  getDay(date: Date){
        if (this.getRestDays(date) <= 1) {
      return ' day';
    } else {
      return ' days';
    };
  };
};
