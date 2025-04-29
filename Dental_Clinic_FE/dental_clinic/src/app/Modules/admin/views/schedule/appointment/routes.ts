import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { Title } from '@angular/platform-browser';

const defaultUrl = ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.path;

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Appointment',
        },
        children: [
            {
                path: '',
                redirectTo: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.LIST.path,
                pathMatch: 'full'
            },
            {
                path: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.LIST.path,
                loadComponent() {
                    return import('./appointment.component')
                        .then(m => m.AppointmentComponent);
                },
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.CREATE.path,
                loadComponent() {
                    return import('./create-appointment/create-appointment.component')
                        .then(m => m.CreateAppointmentComponent);
                },
                data: {
                    title: 'Create'
                }
            }
        ]
    }
];