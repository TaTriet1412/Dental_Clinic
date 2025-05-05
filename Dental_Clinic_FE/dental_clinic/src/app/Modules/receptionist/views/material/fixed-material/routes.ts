import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.MATERIAL.children.FIXED.children.LIST.path;

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Fixed',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.FIXED.children.LIST.path,
                loadComponent() {
                    return import('./fixed-material.component')
                        .then(m => m.FixedMaterialComponent);
                },
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.FIXED.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-fixed-material/detail-fixed-material.component')
                        .then(m => m.DetailFixedMaterialComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
        ]
    }
];