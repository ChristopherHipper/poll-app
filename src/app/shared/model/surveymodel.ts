import { Question } from '../interface/question';
import { Survey } from '../interface/survey';


export class Surveymodel implements Survey {
    id: number;
    title: string;
    description: string;
    category: string;
    end_date: string;
    rest_days: number | string;
    isEnded: boolean;
    questions: Question[];


    constructor(data: Partial<Survey> = {}) {
        this.id = data.id ?? 0;
        this.title = data.title ?? "";
        this.description = data.description ?? "";
        this.category = data.category ?? "";
        this.end_date = data.end_date ?? "";
        this.rest_days = this.getRestDays(data.end_date) ?? 0;
        this.isEnded = this.getState(this.getRestDays(data.end_date)) ?? false;
        this.questions = data.questions ?? [];
    }

    /**
 * Returns a sanitized JSON representation of the survey.
 *
 * @returns A plain object containing the survey's core fields.
 */
    getCleanJson() {
        return {
            title: this.title,
            description: this.description,
            category: this.category,
            end_date: this.end_date,
        };
    };

    /**
 * Calculates the remaining days until the given end date.
 *
 * @param end_Date - The end date as an ISO string.
 * @returns The number of remaining days, 0 if expired, or 'never' if no date is provided.
 */
    getRestDays(end_Date: string | undefined): number | string {
        if (end_Date) {
            const targetDate = new Date(end_Date);
            const dayDate = new Date();
            const oneDay = 24 * 60 * 60 * 1000;
            const diffInMilliseconds = targetDate.getTime() - dayDate.getTime();
            let restDays = Math.round(diffInMilliseconds / oneDay);
            if (restDays < 0) {
                return 0
            } else {
                return restDays + 1;
            };
        } else {
            return 'never'
        };
    };

    /**
 * Determines whether a survey is in a finished state.
 *
 * @param restDays - Remaining days or 'never' if no end date is set.
 * @returns True if the survey is considered ended, otherwise false.
 */
    getState(restDays: number | string): boolean {
        if (restDays == 'never' || restDays !== 0) {
            return false
        } else {
            return true
        };
    };

}