import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Employees'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.ASSISTANT.path,
                data: {
                    title: 'Assistant',
                },
                loadChildren: () => import('./assistant/routes').then(m => m.routes),
            },
            {
                path: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.path,
                data: {
                    title: 'Dentist',
                },
                loadChildren: () => import('./dentist/routes').then(m => m.routes),
            }
        ],
    }
];