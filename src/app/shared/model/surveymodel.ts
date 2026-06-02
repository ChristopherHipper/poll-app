import { Survey } from '../interface/survey';


export class Surveymodel implements Survey {
    id: number;
    title: string;
    description: string;
    category: string;
    end_date: Date;
    rest_days: number
    isEnded:boolean

    constructor(data: Partial<Survey> = {}) {
        this.id = data.id ?? 0;
        this.title = data.title ?? "";
        this.description = data.description ?? "";
        this.category = data.category ?? '';
        this.end_date = data.end_date ?? new Date();
        this.rest_days = data.rest_days ?? 0;
        this.isEnded = data.isEnded ?? false;
    }


    // damit wir nicht eine vordefinierte ID in supabase pushen. Die soll supabase selber erstellen. Deswegen ein JSON ohne ID
    getCleanJson() {
        return {
            name: this.title,
            description: this.description,
            category: this.category,
            end_date: this.end_date,
        }
    }
}