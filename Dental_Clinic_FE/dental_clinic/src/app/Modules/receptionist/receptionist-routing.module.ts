import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';
import { ROUTES } from '../../core/constants/routes.constant';

const default_url: string =  ROUTES.RECEPTIONIST.children.SCHEDULE.path;

const routes: Routes = [
  {
    path: "",
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: ROUTES.RECEPTIONIST.children.SCHEDULE.path,
        loadChildren: () => import('./views/schedule/routes').then(m => m.routes)
      },
      {
        path: ROUTES.RECEPTIONIST.children.EMPLOYEE.path,
        loadChildren: () => import('./views/employee/routes').then(m => m.routes)
      },
      {
        path: ROUTES.RECEPTIONIST.children.FACULTY.path,
        loadChildren: () => import('./views/faculty/routes').then(m => m.routes)
      },
      {
        path: ROUTES.RECEPTIONIST.children.PATIENT.path,
        loadChildren: () => import('./views/patient/routes').then(m => m.routes)
      },
      {
        path: ROUTES.RECEPTIONIST.children.SERVICE.path,
        loadChildren: () => import('./views/dental/routes').then(m => m.routes)
      },
      {
        path: ROUTES.RECEPTIONIST.children.MATERIAL.path,
        loadChildren: () => import('./views/material/routes').then(m => m.routes)
      },
      {
        path: ROUTES.RECEPTIONIST.children.PRESCRIPTION.path,
        loadChildren: () => import('./views/prescription/routes').then(m => m.routes)
      },
      {
        path: ROUTES.RECEPTIONIST.children.PAYMENT.path,
        loadChildren: () => import('./views/payment/routes').then(m => m.routes)
      },
      { path: "", redirectTo:  default_url, pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: "**", redirectTo: ROUTES.NOT_FOUND.path }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionistRoutingModule { }
