import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';
import { LoginComponent } from './default-ui/login/login.component';
import { ROUTES } from '../../core/constants/routes.constant';

const default_url = ROUTES.USER.childer.LOGIN.path;

const routes: Routes = [
  { path: "", component: DefaultUiComponent,children: [
      { path: ROUTES.USER.childer.LOGIN.path, component:  LoginComponent},
      { path: "", redirectTo: default_url, pathMatch: 'full'},
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: "**", redirectTo: ROUTES.NOT_FOUND.path }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
