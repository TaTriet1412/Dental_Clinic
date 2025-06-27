import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MyToastModule } from '../../share/ui/toast/toast.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MyToastModule,
  ],
  providers: [
    provideHttpClient(withFetch()),
  ]
})
export class AdminModule { }
