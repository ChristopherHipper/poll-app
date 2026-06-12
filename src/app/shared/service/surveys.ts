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
    const mappedSurveys = (Surveys ?? []).map(
      s => new Surveymodel(s)
    );
    this.sortAnswers(mappedSurveys)
    this.surveys.set(mappedSurveys);
  };

  sortAnswers(surveys: Surveymodel[]) {
    surveys.forEach((s) => {
      for (const question of s.questions) {
        question.answers.sort((a, b) => a.id - b.id);
      }
    })

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

  async getSurveyById(id: number) {
    let currentSurvey = this.surveys().find(survey => survey.id === id);
    if (currentSurvey) {
      this.singleSurvey.set(currentSurvey);
    } else {
      let { data: Surveys, error } = await this.supabase
        .from('surveys')
        .select(`*,questions (*,answers (*))`)
        .eq('id', id)
      if (error) throw error;
      const mappedSurveys = (Surveys ?? []).map(
        s => new Surveymodel(s)
      );
      this.sortAnswers(mappedSurveys)
      this.singleSurvey.set(mappedSurveys[0]);
    }
    console.log(this.singleSurvey());

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
      .from('questions')
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
      .from('answers')
      .insert([{
        question_id: id,
        answer: answer.answer,
        votes: 0
      }])
      .select()
    if (error) throw error;
  };

  async editSurveyVotes(counter: number, id: number) {
    const { error } = await this.supabase
      .from('answers')
      .update({ votes: counter })
      .eq('id', id)
  }





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


