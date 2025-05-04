import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.SERVICE.children.DENTAL.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Dentals'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.ADMIN.children.SERVICE.children.DENTAL.children.LIST.path,
                loadComponent: () =>
                    import('./dental.component')
                        .then(m => m.DentalComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.ADMIN.children.SERVICE.children.DENTAL.children.CREATE.path,
                data: {
                    title: 'Create',
                },
                loadComponent: () => import('./create-dental/create-dental.component').then(m => m.CreateDentalComponent),
            },
            {
                path: ROUTES.ADMIN.children.SERVICE.children.DENTAL.children.EDIT.path,
                data: {
                    title: 'Edit',
                },
                loadComponent: () => import('./edit-dental/edit-dental.component').then(m => m.EditDentalComponent),
            },
            {
                path: ROUTES.ADMIN.children.SERVICE.children.DENTAL.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-dental/detail-dental.component').then(m => m.DetailDentalComponent),
            },
        ],
    }
];