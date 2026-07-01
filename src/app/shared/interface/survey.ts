import { Question } from "./question";

export interface Survey {
    id: number;
    title: string;
    description: string;
    category: string;
    end_date: string;
    rest_days: number | string;
    isEnded:boolean;
    questions: Question[];
}
