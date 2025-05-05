import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.MATERIAL.children.FIXED.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Materials'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.FIXED.path,
                loadChildren: () => import('./fixed-material/routes').then(m => m.routes),
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.CONSUMABLE.path,
                loadChildren: () => import('./consumable-material/routes').then(m => m.routes),
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.INGREDIENT.path,
                loadChildren: () => import('./ingredient/routes').then(m => m.routes),
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.CATEGORY.path,
                loadChildren: () => import('./category/routes').then(m => m.routes),
            }
        ],
    }
];