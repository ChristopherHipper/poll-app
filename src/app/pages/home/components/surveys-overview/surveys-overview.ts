import { Component } from '@angular/core';
import { EndingSoonSurveys } from "./components/ending-soon-surveys/ending-soon-surveys";
import { SurveyList } from "./components/survey-list/survey-list";

@Component({
  selector: 'app-surveys-overview',
  imports: [EndingSoonSurveys, SurveyList],
  templateUrl: './surveys-overview.html',
  styleUrl: './surveys-overview.scss',
})
export class SurveysOverview {

}
