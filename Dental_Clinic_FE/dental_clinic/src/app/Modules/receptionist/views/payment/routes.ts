import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const defaultUrl = ROUTES.RECEPTIONIST.children.PAYMENT.children.LIST.path;


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Bills'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.RECEPTIONIST.children.PAYMENT.children.LIST.path,
                loadComponent: () =>
                    import('./payment.component')
                        .then(m => m.PaymentComponent),
                data: {
                    title: 'List',
                },
            },
            {
                path: ROUTES.RECEPTIONIST.children.PAYMENT.children.CREATE.path,
                data: {
                    title: 'Create',
                },
                loadComponent: () => import('./create-payment/create-payment.component').then(m => m.CreatePaymentComponent),
            },
            {
                path: ROUTES.RECEPTIONIST.children.PAYMENT.children.EDIT.path,
                data: {
                    title: 'Edit',
                },
                loadComponent: () => import('./edit-payment/edit-payment.component').then(m => m.EditPaymentComponent),
            },
            {
                path: ROUTES.RECEPTIONIST.children.PAYMENT.children.DETAIL.path,
                data: {
                    title: 'Detail',
                },
                loadComponent: () => import('./detail-payment/detail-payment.component').then(m => m.DetailPaymentComponent),
            },
        ],
    }
];