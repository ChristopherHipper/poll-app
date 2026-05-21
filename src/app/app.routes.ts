import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Survey } from './pages/survey/survey';
import { NewSurvey } from './pages/new-survey/new-survey';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'survey/:id',
        component: Survey
    },
    {
        path: 'New-Survey',
        component: NewSurvey
    },
];
