import { Component, computed, inject, signal } from '@angular/core';
import { Dropdown } from "../../../../../../shared/dropdown/dropdown";
import { Surveys } from '../../../../../../shared/service/surveys';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-survey-list',
  imports: [Dropdown, RouterLink],
  templateUrl: './survey-list.html',
  styleUrl: './survey-list.scss',
})
export class SurveyList {
  surveyService = inject(Surveys);
  surveys = this.surveyService.surveys;
  sortedBy = signal<'active' | 'ended'>('active');
  category = signal('');
  filteredSurveys = computed(() => {
    const isEnded = this.sortedBy() === 'active' ? false : true;
    const category = this.category();
    if (category === '') {
      return this.surveys().filter(survey => survey.isEnded === isEnded);
    } else {
      return this.surveys().filter(survey => survey.isEnded === isEnded && survey.category === category);
    };
  });

  /**
 * Sets the current filter.
 *
 * @param filter - The filter to apply.
 */
  setFilter(filter: 'active' | 'ended') {
    this.sortedBy.set(filter);
  };

  /**
 * Sets the selected category.
 *
 * @param value - The category to apply.
 */
  sortByCategory(value: string) {
    this.category.set(value);
  };

  /**
* Returns the correct day label based on the given number of days.
*
* @param days - The number of days or a string value.
* @returns The singular or plural day label, or `undefined` if the input is a string.
*/
  getDay(days: number | string) {
    if (days == 'never') {
      return ' never'
    } else if (days == 1) {
      return 'in ' + days + ' day';
    } else {
      return 'in ' + days + ' days';
    };
  };
}
