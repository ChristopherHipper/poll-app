import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SurveyDetail } from './pages/survey-detail/survey-detail';
import { SurveyForm } from './pages/survey-form/survey-form';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'survey/:id',
        component: SurveyDetail
    },
    {
        path: 'New-Survey',
        component: SurveyForm
    },
];
