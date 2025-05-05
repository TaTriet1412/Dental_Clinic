import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.DENTIST.children.SCHEDULE.children.APPOINTMENT.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Schedules'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.DENTIST.children.SCHEDULE.children.WORK.path,
                loadComponent: () =>
                    import('./work-schedule/work-schedule.component')
                        .then(m => m.WorkScheduleComponent),
                data: {
                    title: 'Work',
                },
            },
            {
                path: ROUTES.DENTIST.children.SCHEDULE.children.APPOINTMENT.path,
                data: {
                    title: 'Appointment',
                },
                loadChildren: () => import('./appointment/routes').then(m => m.routes),
            }
        ],
    }
];