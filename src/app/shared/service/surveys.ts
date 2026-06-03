import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Survey } from '../interface/survey';
import { environment } from '../../../environments/environment'
import { Surveymodel } from '../model/surveymodel';
import { Question } from '../interface/question';
import { Answer } from '../interface/answer';

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
      isEnded: this.getState(this.getRestDays(survey))
    })))
  }

  getRestDays(survey: Survey): number {
    const targetDate = new Date(survey.end_date);
    const dayDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffInMilliseconds = targetDate.getTime() - dayDate.getTime();
    let restDays = Math.round(diffInMilliseconds / oneDay);
    return restDays;
  }

  getState(restDays: number): boolean {
    if (restDays < 0) {
      return true
    } else {
      return false
    }
  }


  async addSurvey(survey: Surveymodel) {
    const cleanJsonSurvey = survey.getCleanJson();
    const { data: createdSurvey, error } = await this.supabase
      .from('Surveys')
      .insert([cleanJsonSurvey])
      .select()
      .single();

    if (error) throw error;
    for (const question of survey.questions) {
      await this.addQuestion(question, createdSurvey.id);
    }
  }

  async addQuestion(question: Question, id: number) {
    const { data: createdQuestion, error } = await this.supabase
      .from('Questions')
      .insert([{
        survey_id: id,
        question: question.question,
        allowMultipleAnswers: question.allowMultipleAnswers
      }])
      .select()
      .single()
    if (error) throw error;
    for (const answer of question.answers) {
      await this.addAnswer(answer, createdQuestion.id);
    }
  }


  async addAnswer(answer: Answer, id: number) {
    const { data, error } = await this.supabase
      .from('Answers')
      .insert([{
        question_id: id,
        answer: answer.answer,
        votes: 0
      }])
      .select()
    if (error) throw error;
  }
}


