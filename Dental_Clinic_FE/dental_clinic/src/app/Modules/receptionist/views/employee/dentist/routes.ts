import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Dentist',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.children.LIST.path,
                data: {
                    title: 'List',
                },
                loadComponent() {
                    return import('./dentist.component')
                        .then(m => m.DentistComponent);
                },
            },
            {
                path: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.children.CREATE.path,
                loadComponent() {
                    return import('./create-dentist/create-dentist.component')
                        .then(m => m.CreateDentistComponent);
                },
                data: {
                    title: 'Create'
                }
            },
            {
                path: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-dentist/detail-dentist.component')
                        .then(m => m.DetailDentistComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
            {
                path: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.children.EDIT.path,
                loadComponent() {
                    return import('./edit-dentist/edit-dentist.component')
                        .then(m => m.EditDentistComponent);
                },
                data: {
                    title: 'Edit'
                }
            }
        ],
    }
];