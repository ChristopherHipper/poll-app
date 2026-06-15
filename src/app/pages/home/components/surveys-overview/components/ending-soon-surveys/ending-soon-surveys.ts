import { Component, inject, signal } from '@angular/core';
import { Surveys } from '../../../../../../shared/service/surveys';
import { RouterLink } from "@angular/router";
import { Survey } from '../../../../../../shared/interface/survey';

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

  getDay(days: number | string) {
    if (typeof days === 'string') {return}
    if (days > 1) {
        return ' days';
      } else {
        return ' day';
      };
  };

isEndingSoon(days: number | string){
  return typeof days === 'number' && days > 0 && days < 10
}
};
