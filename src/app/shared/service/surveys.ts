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
  supabase = createClient(environment.ApiUrl, environment.ApiKey);
  surveys = signal<Survey[]>([]);

  constructor() {
    this.getSurveys();
  };

  async getSurveys() {
    let { data: Surveys, error } = await this.supabase
      .from('surveys')
      .select(`*,questions (*,answers (*))`);

    if (error) throw error;
    const mappedProducts = (Surveys ?? []).map(
      s => new Surveymodel(s)
    );
    this.surveys.set(mappedProducts);
    this.getCorrectDate();
  };

  getCorrectDate() {
    this.surveys.update(surveys => surveys.map(survey => ({
      ...survey,
      rest_days: this.getRestDays(survey),
      isEnded: this.getState(this.getRestDays(survey)),
    })));
  };

  getRestDays(survey: Survey): number {
    const targetDate = new Date(survey.end_date);
    const dayDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffInMilliseconds = targetDate.getTime() - dayDate.getTime();
    let restDays = Math.round(diffInMilliseconds / oneDay);
    return restDays + 1;
  };

  getState(restDays: number): boolean {
    if (restDays <= 0) {
      return true
    } else {
      return false
    }
  }

  singleSurvey = signal<Survey>({
    "id": 0,
    "title": "",
    "description": "",
    "category": "",
    "end_date": "",
    "rest_days": 0,
    "isEnded": false,
    "questions": [],
  });

  getSurveyById(id: number) {
    let currentSurvey = this.surveys().find(survey => survey.id === id);
    if (currentSurvey) {
      this.singleSurvey.set(currentSurvey);
    };
  };

  async addSurvey(survey: Surveymodel) {
    const cleanJsonSurvey = survey.getCleanJson();
    const { data: createdSurvey, error } = await this.supabase
      .from('surveys')
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
    };
  };

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
  };







  // getCompleteSurvey() {
  //   this.questions.update(questions => questions.map(question => ({
  //     ...question,
  //     answers: this.slectCorrectAnswers(question.id)
  //   })));

  //   this.surveys.update(surveys => surveys.map(survey => ({
  //     ...survey,
  //     questions: this.slectCorrectQuestions(survey.id)
  //   })));
  // }

  // slectCorrectAnswers(id: number): Answer[] {
  //   const answers = this.answers().filter((answer) => {
  //     return answer.question_id == id;
  //   });
  //   return answers
  // }

  // slectCorrectQuestions(id: number): Question[] {
  //   const questions = this.questions().filter((question) => {
  //     return question.survey_id == id;
  //   });
  //   return questions
  // }

  // async getQuestions() {
  //   let { data: Questions, error } = await this.supabase
  //     .from('questions')
  //     .select('*')
  //   this.questions.set((Questions) ?? [] as Question[]);
  // }

  // async getAnswers() {
  //   let { data: Answers, error } = await this.supabase
  //     .from('answers')
  //     .select('*')
  //   this.answers.set((Answers) ?? [] as Answer[]);
  // }
};


