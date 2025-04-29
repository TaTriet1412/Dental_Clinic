import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';
import { Title } from '@angular/platform-browser';

const defaultUrl = ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.path;

// export const routes: Routes = [
//     {
//         path: '',
//         data: {
//             title: 'Schedules'
//         },
//         children: [
//             {
//                 path: '',
//                 redirectTo: defaultUrl,
//                 pathMatch: 'full'
//             },
//             {
//                 path: ROUTES.ADMIN.children.SCHEDULE.children.WORK.path,
//                 loadComponent: () =>
//                     import('./work-schedule/work-schedule.component')
//                         .then(m => m.WorkScheduleComponent),
//                 data: {
//                     title: 'Work',
//                 },
//             },
//             {
//                 path: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.path,
//                 loadComponent() {
//                     return import('./appointment/appointment.component')
//                         .then(m => m.AppointmentComponent);
//                 },
//                 data: {
//                     title: 'Appointment',
//                 },
//                 children: [
//                     {
//                         path: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.CREATE.path,
//                         loadComponent() {
//                                 return import('./appointment/create-appointment/create-appointment.component')
//                                     .then(m => m.CreateAppointmentComponent);
//                         }
//                     }
//                 ]
//             }
//         ],
//     }
// ];



export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Schedules'
        },
        children: [
            {
                path: '',
                redirectTo: defaultUrl,
                pathMatch: 'full'
            },
            {
                path: ROUTES.ADMIN.children.SCHEDULE.children.WORK.path,
                loadComponent: () =>
                    import('./work-schedule/work-schedule.component')
                        .then(m => m.WorkScheduleComponent),
                data: {
                    title: 'Work',
                },
            },
            {
                path: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.path,
                data: {
                    title: 'Appointment',
                },
                loadChildren: () => import('./appointment/routes').then(m => m.routes),
            }
        ],
    }
];