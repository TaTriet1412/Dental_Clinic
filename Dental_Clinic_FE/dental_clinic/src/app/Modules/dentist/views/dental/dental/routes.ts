import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.DENTIST.children.SERVICE.children.DENTAL.children.LIST.path;


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
                path: ROUTES.DENTIST.children.SERVICE.children.DENTAL.children.LIST.path,
                loadComponent: () =>
                    import('./dental.component')
                        .then(m => m.DentalComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.DENTIST.children.SERVICE.children.DENTAL.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-dental/detail-dental.component').then(m => m.DetailDentalComponent),
            },
        ],
    }
];