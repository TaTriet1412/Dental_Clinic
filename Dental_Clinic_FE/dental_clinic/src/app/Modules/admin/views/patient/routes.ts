import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.PATIENT.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Patients',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.ADMIN.children.PATIENT.children.LIST.path,
                loadComponent: () =>
                    import('./patient.component')
                        .then(m => m.PatientComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.ADMIN.children.PATIENT.children.CREATE.path,
                data: {
                    title: 'Create',
                },
                loadComponent: () => import('./create-patient/create-patient.component').then(m => m.CreatePatientComponent),
            },
            {
                path: ROUTES.ADMIN.children.PATIENT.children.EDIT.path,
                data: {
                    title: 'Edit',
                },
                loadComponent: () => import('./edit-patient/edit-patient.component').then(m => m.EditPatientComponent),
            },
            {
                path: ROUTES.ADMIN.children.PATIENT.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-patient/detail-patient.component').then(m => m.DetailPatientComponent),
            },
        ],
    }
];