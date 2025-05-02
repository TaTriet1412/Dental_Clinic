import { Routes } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.ADMIN.children.EMPLOYEE.children.ASSISTANT.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Assisstant',
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.ASSISTANT.children.LIST.path,
                data: {
                    title: 'List',
                },
                loadComponent() {
                    return import('./assistant.component')
                        .then(m => m.AssistantComponent);
                },
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.ASSISTANT.children.CREATE.path,
                loadComponent() {
                    return import('./create-assistant/create-assistant.component')
                        .then(m => m.CreateAssistantComponent);
                },
                data: {
                    title: 'Create'
                }
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.ASSISTANT.children.DETAIL.path,
                loadComponent() {
                    return import('./detail-assistant/detail-assistant.component')
                        .then(m => m.DetailAssistantComponent);
                },
                data: {
                    title: 'Detail'
                }
            },
            {
                path: ROUTES.ADMIN.children.EMPLOYEE.children.ASSISTANT.children.EDIT.path,
                loadComponent() {
                    return import('./edit-assistant/edit-assistant.component')
                        .then(m => m.EditAssistantComponent);
                },
                data: {
                    title: 'Edit'
                }
            }
        ],
    }
];