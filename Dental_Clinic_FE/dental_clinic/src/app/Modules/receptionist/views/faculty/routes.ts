import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.FACULTY.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Faculties'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.FACULTY.children.LIST.path,
                loadComponent: () =>
                    import('./faculty.component')
                        .then(m => m.FacultyComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.RECEPTIONIST.children.FACULTY.children.CREATE.path,
                data: {
                    title: 'Create',
                },
                loadComponent: () => import('./create-faculty/create-faculty.component').then(m => m.CreateFacultyComponent),
            },
            {
                path: ROUTES.RECEPTIONIST.children.FACULTY.children.EDIT.path,
                data: {
                    title: 'Edit',
                },
                loadComponent: () => import('./edit-faculty/edit-faculty.component').then(m => m.EditFacultyComponent),
            },
            {
                path: ROUTES.RECEPTIONIST.children.FACULTY.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-faculty/detail-faculty.component').then(m => m.DetailFacultyComponent),
            },
        ],
    }
];