import { Component, inject } from '@angular/core';
import { Logo } from "../../shared/logo/logo";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Status } from "../../shared/status/status";
import { Surveys } from '../../shared/service/surveys';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-survey-detail',
  imports: [Logo, RouterLink, Status, DatePipe],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  router = inject(Router)
  private route = inject(ActivatedRoute);
  surveyService = inject(Surveys)
  singleSurvey = this.surveyService.singleSurvey

  ngOnInit() {
    console.log(this.surveyService.surveys());
    
    const currentid = this.route.snapshot.paramMap.get('id');
    if (!currentid) return;
    this.surveyService.getSurveyById(+currentid)
  };

}
