import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.SERVICE.children.CATEGORY.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Categories'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.SERVICE.children.CATEGORY.children.LIST.path,
                loadComponent: () =>
                    import('./category.component')
                        .then(m => m.CategoryComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.RECEPTIONIST.children.SERVICE.children.CATEGORY.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-category/detail-category.component').then(m => m.DetailCategoryComponent),
            },
        ],
    }
];