import { Component, computed, inject, signal } from '@angular/core';
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
  sortedSurveys = computed(() => {
    return [...this.surveys()].sort((a, b) => {
      if (typeof a.rest_days === 'number' && typeof b.rest_days === 'number') {
        return a.rest_days - b.rest_days
      } else if (typeof a.rest_days === 'number' && b.rest_days === 'never') {
        return -1;
      }
      else if (a.rest_days === 'never' && typeof b.rest_days === 'number') {
        return 1;
      } else {
        return 0;
      };
    });
  });

  /**
 * Returns the correct day label based on the given number of days.
 *
 * @param days - The number of days or a string value.
 * @returns The singular or plural day label, or `undefined` if the input is a string.
 */
  getDay(days: number | string) {
    if (typeof days === 'string') { return }
    if (days > 1) {
      return ' days';
    } else {
      return ' day';
    };
  };

  /**
 * Checks whether the given number of days indicates an ending soon state.
 *
 * @param days - The number of days or a string value.
 * @returns `true` if the value is between 1 and 19 days, otherwise `false`.
 */
  isEndingSoon(days: number | string) {
    return typeof days === 'number' && days > 0 && days < 20;
  };
};
