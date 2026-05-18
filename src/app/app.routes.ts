import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Survey } from './pages/survey/survey';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'NewSurvey',
        component: Survey
    },
];
