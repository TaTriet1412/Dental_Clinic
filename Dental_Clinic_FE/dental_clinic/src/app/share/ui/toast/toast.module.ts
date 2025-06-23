import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from './toast-container.component';
import { ProgressModule, ToastModule } from '@coreui/angular-pro';

@NgModule({
  declarations: [ToastContainerComponent],
  imports: [
    CommonModule,
    ToastModule,
    ProgressModule
  ],
  exports: [ToastContainerComponent]
})
export class MyToastModule {}
