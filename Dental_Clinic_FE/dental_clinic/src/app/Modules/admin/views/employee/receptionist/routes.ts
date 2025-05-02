import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Receptionist',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.children.LIST.path,
                data: {
                    title: 'List',
                },
                loadComponent() {
                    return import('./receptionist.component')
                        .then(m => m.ReceptionistComponent);
                },
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.children.CREATE.path,
                loadComponent() {
                    return import('./create-receptionist/create-receptionist.component')
                        .then(m => m.CreateReceptionistComponent);
                },
                data: {
                    title: 'Create'
                }
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-receptionist/detail-receptionist.component')
                        .then(m => m.DetailReceptionistComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.children.EDIT.path,
                loadComponent() {
                    return import('./edit-receptionist/edit-receptionist.component')
                        .then(m => m.EditReceptionistComponent);
                },
                data: {
                    title: 'Edit'
                }
            }
        ],
    }
];