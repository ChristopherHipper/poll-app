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

  constructor(){
    this.getAllSurveys()
  }

  async getAllSurveys() {
    let { data: Surveys, error } = await this.supabase
      .from('Surveys')
      .select('*')
    this.surveyList.set((Surveys) ?? [] as Survey[])
  }
}
