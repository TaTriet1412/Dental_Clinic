import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.LIST.path;

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
            },
            {
                path: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-appointment/detail-appointment.component')
                        .then(m => m.DetailAppointmentComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
            {
                path: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.EDIT.path,
                loadComponent() {
                    return import('./edit-appointment/edit-appointment.component')
                        .then(m => m.EditAppointmentComponent);
                },
                data: {
                    title: 'Edit'
                }
            }
        ]
    }
];