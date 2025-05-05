import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.DENTIST.children.SCHEDULE.children.APPOINTMENT.children.LIST.path;

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Appointment',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.DENTIST.children.SCHEDULE.children.APPOINTMENT.children.LIST.path,
                loadComponent() {
                    return import('./appointment.component')
                        .then(m => m.AppointmentComponent);
                },
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.DENTIST.children.SCHEDULE.children.APPOINTMENT.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-appointment/detail-appointment.component')
                        .then(m => m.DetailAppointmentComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
        ]
    }
];