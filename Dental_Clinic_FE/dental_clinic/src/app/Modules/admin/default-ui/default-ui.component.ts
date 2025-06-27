import { Component, signal, ViewChild } from '@angular/core';
import {
  ContainerComponent,
  ModalComponent,
  ModalModule,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { navItems } from './_nav';

import { NgScrollbar } from 'ngx-scrollbar';
import { SidebarModule } from '@coreui/angular-pro';
import { CommonModule } from '@angular/common';
import { MyToastModule } from '../../../share/ui/toast/toast.module';

@Component({
  selector: 'app-default-ui',
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    ModalModule,
    CommonModule,
    MyToastModule,
  ],
  templateUrl: './default-ui.component.html',
  styleUrl: './default-ui.component.scss',
})
export class DefaultUiComponent {
  public navItems = [...navItems];

  // **** THÊM State và ViewChild cho Modal ****
  notificationToShow = signal<Notification | null>(null);
  @ViewChild('uiNotificationModal') notificationModal?: ModalComponent; // Tham chiếu đến modal trong template

  // **** THÊM Hàm xử lý sự kiện từ con ****
  handleOpenNotificationRequest(notification: Notification): void {
    console.log('Parent received request to open modal for:', notification);
    this.notificationToShow.set(notification);
    // Mở modal theo cách lập trình
    this.notificationModal!.visible = true;
  }

  // **** THÊM Hàm xử lý khi modal đóng ****
  handleUiModalClose(): void {
    console.log('Parent modal closed');
    // Reset dữ liệu khi modal đóng để đảm bảo lần mở sau đúng
    this.notificationToShow.set(null);
  }
}