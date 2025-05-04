import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.SERVICE.children.CATEGORY.children.LIST.path;


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
                path: ROUTES.ADMIN.children.SERVICE.children.CATEGORY.children.LIST.path,
                loadComponent: () =>
                    import('./category.component')
                        .then(m => m.CategoryComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.ADMIN.children.SERVICE.children.CATEGORY.children.CREATE.path,
                data: {
                    title: 'Create',
                },
                loadComponent: () => import('./create-category/create-category.component').then(m => m.CreateCategoryComponent),
            },
            {
                path: ROUTES.ADMIN.children.SERVICE.children.CATEGORY.children.EDIT.path,
                data: {
                    title: 'Edit',
                },
                loadComponent: () => import('./edit-category/edit-category.component').then(m => m.EditCategoryComponent),
            },
            {
                path: ROUTES.ADMIN.children.SERVICE.children.CATEGORY.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-category/detail-category.component').then(m => m.DetailCategoryComponent),
            },
        ],
    }
];