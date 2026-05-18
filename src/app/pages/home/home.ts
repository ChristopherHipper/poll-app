import { Component } from '@angular/core';
import { HeroSection } from './components/hero-section/hero-section';
import { TempSurveys } from "./components/temp-surveys/temp-surveys";

@Component({
  selector: 'app-home',
  imports: [HeroSection, TempSurveys],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
