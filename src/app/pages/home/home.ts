import { Component } from '@angular/core';
import { HeroSection } from './components/hero-section/hero-section';
import { SurveysOverview } from "./components/surveys-overview/surveys-overview";

@Component({
  selector: 'app-home',
  imports: [HeroSection, SurveysOverview],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
