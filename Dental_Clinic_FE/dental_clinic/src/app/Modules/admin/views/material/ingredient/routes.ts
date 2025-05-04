import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.MATERIAL.children.INGREDIENT.children.LIST.path;

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Ingredient',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.ADMIN.children.MATERIAL.children.INGREDIENT.children.LIST.path,
                loadComponent() {
                    return import('./ingredient.component')
                        .then(m => m.IngredientComponent);
                },
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.ADMIN.children.MATERIAL.children.INGREDIENT.children.CREATE.path,
                loadComponent() {
                    return import('./create-ingredient/create-ingredient.component')
                        .then(m => m.CreateIngredientComponent);
                },
                data: {
                    title: 'Create'
                }
            },
            {
                path: ROUTES.ADMIN.children.MATERIAL.children.INGREDIENT.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-ingredient/detail-ingredient.component')
                        .then(m => m.DetailIngredientComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
            {
                path: ROUTES.ADMIN.children.MATERIAL.children.INGREDIENT.children.EDIT.path,
                loadComponent() {
                    return import('./edit-ingredient/edit-ingredient.component')
                        .then(m => m.EditIngredientComponent);
                },
                data: {
                    title: 'Edit'
                }
            }
        ]
    }
];