import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Survey } from '../interface/survey';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  supabase = createClient(environment.ApiUrl, environment.ApiKey)
  surveyList = signal<Survey[]>([]);

  constructor() {
    this.getAllSurveys()
  }

  async getAllSurveys() {
    let { data: Surveys, error } = await this.supabase
      .from('Surveys')
      .select('*')
    this.surveyList.set((Surveys) ?? [] as Survey[])
    this.getCorrectDate()
  }

  getCorrectDate() {
    this.surveyList.update(surveys => surveys.map(survey => ({
      ...survey,
      rest_days: this.getRestDays(survey),
      isEnded: this.getState( this.getRestDays(survey))
    })))
  }

  getRestDays(survey: Survey):number {
    const targetDate = new Date(survey.end_date);
    const dayDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffInMilliseconds = targetDate.getTime() - dayDate.getTime();
    let restDays = Math.round(diffInMilliseconds / oneDay);
    return restDays;
  }

  getState(restDays:number):boolean{
    if (restDays < 0) {
      return true
    } else {
      return false
    }
  }
}
