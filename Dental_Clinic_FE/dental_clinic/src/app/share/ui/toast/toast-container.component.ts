import { Component, signal } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastMessage } from './toast.model';

@Component({
    selector: 'app-toast-container',
    standalone: false,
    template: `
    <div class="position-relative">
      <c-toaster placement="top-end" position="absolute">
        <ng-container *ngFor="let toast of toasts">
          <c-toast
            [autohide]="toast.autohide ?? true"
            [delay]="(toast.delay ?? 5000) + 500"
            [visible]="true"
            (timer)="onTimerChange(toast, $event)"
            (hidden)="removeToast(toast)"
            [class.bg-success]="toast.type === 'success'"
            [class.bg-danger]="toast.type === 'error'"
            [class.bg-info]="toast.type === 'info'"
            [class.bg-warning]="toast.type === 'warning'"
          >
            <c-toast-header>
              <strong class="me-auto">{{ toast.title ?? "Teeth Tony"  }}</strong>
              <small class="text-muted">{{ toast.time || 'Now' }}</small>
            </c-toast-header>
            <c-toast-body>
                <p>{{ toast.body }}</p>
                <c-progress *ngIf="toast.progress"
                color="success"
                animated="true"
                variant="striped"
                [value]="progressMap[toast.id ?? ''] || 0" />
            </c-toast-body>
        </c-toast>
        </ng-container>
      </c-toaster>
    </div>
    `,
    styles: [`
    c-toast.bg-success { color: white; }
    c-toast.bg-danger { color: white; }
    c-toast.bg-warning { color: black; }
    c-toast.bg-info { color: white; }
`]
})
export class ToastContainerComponent {
    toasts: ToastMessage[] = [];
    progressMap: { [id: string]: number } = {};

    constructor(private toastService: ToastService) {
        this.toastService.toasts$.subscribe(list => this.toasts = list);
    }

    removeToast(toast: ToastMessage) {
        this.toastService.remove(toast);
        delete this.progressMap[toast.id?? ''];
    }

    onTimerChange(toast: ToastMessage, value: number) {
        console.log("Time: ", value);
        this.progressMap[toast.id?? ''] = Math.round((value*1.0/((((toast.delay ?? 5000))/1000))) * 100);
    }
}
