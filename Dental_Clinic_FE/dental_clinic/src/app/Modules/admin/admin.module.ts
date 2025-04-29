import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { provideHttpClient, withFetch } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ],
  providers: [
    provideHttpClient(withFetch()),
  ]
})
export class AdminModule { }
