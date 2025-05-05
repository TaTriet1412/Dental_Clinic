import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.MATERIAL.children.INGREDIENT.children.LIST.path;

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
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.INGREDIENT.children.LIST.path,
                loadComponent() {
                    return import('./ingredient.component')
                        .then(m => m.IngredientComponent);
                },
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.INGREDIENT.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-ingredient/detail-ingredient.component')
                        .then(m => m.DetailIngredientComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
        ]
    }
];