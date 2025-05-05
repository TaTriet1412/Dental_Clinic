import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.MATERIAL.children.CONSUMABLE.children.LIST.path;

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Consumable',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.CONSUMABLE.children.LIST.path,
                loadComponent() {
                    return import('./consumable-material.component')
                        .then(m => m.ConsumableMaterialComponent);
                },
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.RECEPTIONIST.children.MATERIAL.children.CONSUMABLE.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-consumable-material/detail-consumable-material.component')
                        .then(m => m.DetailConsumableMaterialComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
        ]
    }
];