import { Answer } from "./answer";

export interface Question {
    question:string,
    allowMultipleAnswers: boolean,
    answers: Answer[]
}
