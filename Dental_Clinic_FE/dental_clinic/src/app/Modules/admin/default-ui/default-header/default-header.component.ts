import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import {
  AvatarComponent,
  BadgeModule,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { ModalModule } from '@coreui/angular-pro';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [BadgeModule, CommonModule , ModalModule ,ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  @Output() openNotificationRequest = new EventEmitter<Notification>();
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });


  constructor(
    private router: Router,
    // private authService: AuthService,
    private snackbarService: SnackBarService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  sidebarId = input('sidebar1');

  logout() {
  //   const userEmail = this.authService.getEmail();

  //   if (!userEmail) {
  //     console.error("Logout error: User email not found.");
  //     this.snackbarService.notifyError("Không thể lấy thông tin người dùng để đăng xuất.");
  //     // Force clear local state and redirect if email is missing
  //     this.authService.resetDefaultUser();
  //     this.router.navigate(['']);
  //     return;
  //   }

  //   this.authService.logout(userEmail)
  //     .subscribe({
  //       next: (res) => {
  //         console.log('Logout successful', res);
  //         this.router.navigate(['']);
  //       },
  //       error: (err: any) => { //
  //         const errorMessage = err?.error?.message || 'Đăng xuất không thành công. Vui lòng thử lại.';
  //         this.snackbarService.notifyError(errorMessage);
  //       },
  //       complete: () => { console.log('Logout observable completed.'); }
  //     });
  }
}
