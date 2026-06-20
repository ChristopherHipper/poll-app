import { Injectable, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
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
  surveyListChannel: RealtimeChannel;
  singleSurvey = signal<Survey>({
    "id": 0,
    "title": "",
    "description": "",
    "category": "",
    "end_date": "",
    "rest_days": 0,
    "isEnded": false,
    "questions": [],
    "hasResults": false
  });
  private reloadTimer?: ReturnType<typeof setTimeout>;

  /**
 * Initializes the component, loads surveys, and subscribes to Supabase realtime changes.
 */
  constructor() {
    this.getSurveys();

    this.surveyListChannel = this.supabase
      .channel('all-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public'
      }, payload => {
        clearTimeout(this.reloadTimer);
        this.reloadTimer = setTimeout(() => {
          this.getSurveys();
        }, 500);
      })
      .subscribe();
  };

  /**
 * Fetches all surveys from Supabase including questions and answers,
 * maps them to SurveyModel instances, sorts answers, and updates state.
 */
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

  /**
 * Sorts answers of each question in all surveys by their ID.
 *
 * @param surveys - The list of surveys to process.
 */
  sortAnswers(surveys: Surveymodel[]) {
    surveys.forEach((s) => {
      for (const question of s.questions) {
        question.answers.sort((a, b) => a.id - b.id);
      }
    });
  };

  /**
 * Retrieves a survey by its ID either from local state or from Supabase.
 *
 * @param id - The ID of the survey to retrieve.
 */
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
      this.sortAnswers(mappedSurveys);
      this.singleSurvey.set(mappedSurveys[0]);
    };
  };

  /**
 * Adds a new survey to Supabase and creates its related questions.
 *
 * @param survey - The survey model to be inserted.
 */
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
    };
  };

  /**
 * Adds a question to a survey and creates its related answers.
 *
 * @param question - The question to insert.
 * @param id - The ID of the parent survey.
 */
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

  /**
 * Adds an answer to a question in Supabase.
 *
 * @param answer - The answer to insert.
 * @param id - The ID of the parent question.
 */
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

  /**
 * Updates the vote count of a specific answer.
 *
 * @param counter - The new vote count.
 * @param id - The ID of the answer to update.
 */
  async editSurveyVotes(counter: number, id: number) {
    const { error } = await this.supabase
      .from('answers')
      .update({ votes: counter })
      .eq('id', id)
  }

  /**
 * Cleans up the Supabase realtime subscription when the component is destroyed.
 */
  ngOnDestroy() {
    this.supabase.removeChannel(this.surveyListChannel)
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


