import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '../../core/constants/routes.constant';
import { DefaultUiComponent } from './default-ui/default-ui.component';

const default_url: string =  ROUTES.DENTIST.children.PRESCRIPTION.path;

const routes: Routes = [
  {
    path: "",
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: ROUTES.DENTIST.children.SCHEDULE.path,
        loadChildren: () => import('./views/schedule/routes').then(m => m.routes)
      },
      {
        path: ROUTES.DENTIST.children.PATIENT.path,
        loadChildren: () => import('./views/patient/routes').then(m => m.routes)
      },
      {
        path: ROUTES.DENTIST.children.SERVICE.path,
        loadChildren: () => import('./views/dental/routes').then(m => m.routes)
      },
      {
        path: ROUTES.DENTIST.children.MATERIAL.path,
        loadChildren: () => import('./views/material/routes').then(m => m.routes)
      },
      {
        path: ROUTES.DENTIST.children.PRESCRIPTION.path,
        loadChildren: () => import('./views/prescription/routes').then(m => m.routes)
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
export class DentistRoutingModule { }
