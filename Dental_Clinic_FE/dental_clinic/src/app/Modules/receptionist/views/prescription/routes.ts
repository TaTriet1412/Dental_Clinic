import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.PRESCRIPTION.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Prescriptions'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.PRESCRIPTION.children.LIST.path,
                loadComponent: () =>
                    import('./prescription.component')
                        .then(m => m.PrescriptionComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.RECEPTIONIST.children.PRESCRIPTION.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-prescription/detail-prescription.component').then(m => m.DetailPrescriptionComponent),
            },
        ],
    }
];