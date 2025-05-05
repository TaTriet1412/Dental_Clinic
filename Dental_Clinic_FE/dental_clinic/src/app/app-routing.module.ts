import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './core/constants/routes.constant';
import { NotFoundComponent } from './Modules/error/not-found/not-found.component';
import { AuthAdminGuard } from './core/guards/auth_admin.guard';
import { AuthRedirectGuard } from './core/guards/auth_redirect.guard';
import { ServerError500Component } from './Modules/error/server-error-500/server-error-500.component';
import { AuthDentistGuard } from './core/guards/auth_dentist.guard';

const default_url_role = ROUTES.USER.path;

const routes: Routes = [
  {
    path: ROUTES.USER.path,
    loadChildren: () => import('./Modules/user/user.module').then(m => m.UserModule),
    canActivate: [AuthRedirectGuard]
  },
  {
    path: ROUTES.ADMIN.path,
    loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthAdminGuard]
  },
  {
    path: ROUTES.DENTIST.path,
    loadChildren: () => import('./Modules/dentist/dentist.module').then(m => m.DentistModule),
    canActivate: [AuthDentistGuard]
  },
  // {
  //   path: ROUTES.CHEF.path,
  //   loadChildren: () => import('./Modules/chef/chef.module').then(m => m.ChefModule),
  //   canActivate: [AuthChefGuard]
  // },

  //Khi trang rỗng (ban đầu) thì trang trả về path user
  {
    path: '',
    redirectTo: default_url_role,
    pathMatch: 'full'
  },
  //Khi không tìm thấy đường dẫn nào thì trả về trang không tìm thấy
  { path: ROUTES.NOT_FOUND.path, component: NotFoundComponent },
  { path: ROUTES.SERVER_ERROR.path, component: ServerError500Component},
  //Tất cả đường dẫn không tồn tại thì trả về path not found
  { path: '**', redirectTo: ROUTES.NOT_FOUND.path } // Assuming you have a NotFoundErrorComponent to handle 404 errors,
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
