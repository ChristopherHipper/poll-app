import { Question } from '../interface/question';
import { Survey } from '../interface/survey';


export class Surveymodel implements Survey {
    id: number;
    title: string;
    description: string;
    category: string;
    end_date: string;
    rest_days: number;
    isEnded: boolean;
    questions: Question[]


    constructor(data: Partial<Survey> = {}) {
        this.id = data.id ?? 0;
        this.title = data.title ?? "";
        this.description = data.description ?? "";
        this.category = data.category ?? "";
        this.end_date = data.end_date ?? "";
        this.rest_days = data.rest_days ?? 0;
        this.isEnded = data.isEnded ?? false;
        this.questions = data.questions ?? []
    }

    getCleanJson() {
        return {
            title: this.title,
            description: this.description,
            category: this.category,
            end_date: this.end_date,
        }
    }


}