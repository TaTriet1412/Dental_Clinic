import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.MATERIAL.children.CONSUMABLE.children.LIST.path;

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
                path: ROUTES.ADMIN.children.MATERIAL.children.CONSUMABLE.children.LIST.path,
                loadComponent() {
                    return import('./consumable-material.component')
                        .then(m => m.ConsumableMaterialComponent);
                },
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.ADMIN.children.MATERIAL.children.CONSUMABLE.children.CREATE.path,
                loadComponent() {
                    return import('./create-consumable-material/create-consumable-material.component')
                        .then(m => m.CreateConsumableMaterialComponent);
                },
                data: {
                    title: 'Create'
                }
            },
            {
                path: ROUTES.ADMIN.children.MATERIAL.children.CONSUMABLE.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-consumable-material/detail-consumable-material.component')
                        .then(m => m.DetailConsumableMaterialComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
            {
                path: ROUTES.ADMIN.children.MATERIAL.children.CONSUMABLE.children.EDIT.path,
                loadComponent() {
                    return import('./edit-consumable-material/edit-consumable-material.component')
                        .then(m => m.EditConsumableMaterialComponent);
                },
                data: {
                    title: 'Edit'
                }
            }
        ]
    }
];