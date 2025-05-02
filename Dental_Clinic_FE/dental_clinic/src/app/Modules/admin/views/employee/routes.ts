import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.path;


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
                path: ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.path,
                data: {
                    title: 'Receptionist',
                },
                loadChildren: () => import('./receptionist/routes').then(m => m.routes),
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.ASSISTANT.path,
                data: {
                    title: 'Assistant',
                },
                loadChildren: () => import('./assistant/routes').then(m => m.routes),
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.DENTIST.path,
                data: {
                    title: 'Dentist',
                },
                loadChildren: () => import('./dentist/routes').then(m => m.routes),
            }
        ],
    }
];