import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.DENTIST.children.SERVICE.children.DENTAL.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Services'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.DENTIST.children.SERVICE.children.DENTAL.path,
                data: {
                    title: 'Dentals',
                },
                loadChildren: () => import('./dental/routes').then(m => m.routes),
            },
            {
                path: ROUTES.DENTIST.children.SERVICE.children.CATEGORY.path,
                data: {
                    title: 'Categories',
                },
                loadChildren: () => import('./category/routes').then(m => m.routes),
            },
        ],
    }
];