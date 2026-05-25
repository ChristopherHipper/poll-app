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
  surveys = this.surveyService.surveyList;
  sortedBy = signal<'active' | 'ended'>('active');

  filteredSurveys = computed(() => {
    const isEnded  = this.sortedBy() === 'active' ? false : true;
    return this.surveys().filter(survey => survey.isEnded === isEnded );
  });

  setFilter(filter: 'active' | 'ended') {
    this.sortedBy.set(filter);
  }

  getDay(days: number) {
    if (days > 1) {
      return ' days';
    } else {
      return ' day';
    };
  };

}
