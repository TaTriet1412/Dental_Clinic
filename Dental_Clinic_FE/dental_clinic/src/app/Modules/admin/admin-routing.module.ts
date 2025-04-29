import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '../../core/constants/routes.constant';
import { DefaultUiComponent } from './default-ui/default-ui.component';


const default_url: string =  ROUTES.ADMIN.children.SCHEDULE.path;

const routes: Routes = [
  {
    path: "",
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: ROUTES.ADMIN.children.SCHEDULE.path,
        loadChildren: () => import('./views/schedule/routes').then(m => m.routes)
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
export class AdminRoutingModule { }
