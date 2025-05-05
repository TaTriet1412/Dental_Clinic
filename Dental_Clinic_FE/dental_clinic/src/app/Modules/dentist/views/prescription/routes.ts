import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.DENTIST.children.PRESCRIPTION.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Prescriptions'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.DENTIST.children.PRESCRIPTION.children.LIST.path,
                loadComponent: () =>
                    import('./prescription.component')
                        .then(m => m.PrescriptionComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.DENTIST.children.PRESCRIPTION.children.CREATE.path,
                data: {
                    title: 'Create',
                },
                loadComponent: () => import('./create-prescription/create-prescription.component').then(m => m.CreatePrescriptionComponent),
            },
            {
                path: ROUTES.DENTIST.children.PRESCRIPTION.children.EDIT.path,
                data: {
                    title: 'Edit',
                },
                loadComponent: () => import('./edit-prescription/edit-prescription.component').then(m => m.EditPrescriptionComponent),
            },
            {
                path: ROUTES.DENTIST.children.PRESCRIPTION.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-prescription/detail-prescription.component').then(m => m.DetailPrescriptionComponent),
            },
        ],
    }
];