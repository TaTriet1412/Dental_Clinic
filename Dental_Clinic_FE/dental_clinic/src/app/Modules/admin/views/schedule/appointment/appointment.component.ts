import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, of, ReplaySubject } from 'rxjs'; // Thêm ReplaySubject nếu muốn
import { map, switchMap, tap, takeUntil, startWith, distinctUntilChanged, catchError, take } from 'rxjs/operators'; // Import catchError
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { AlignDirective, BadgeModule, ButtonDirective, CardModule, ColComponent, FormSelectDirective, ModalModule, RowComponent, SpinnerModule } from '@coreui/angular';
import { SmartTableModule, SmartPaginationModule, ISorterValue, IColumn, TemplateIdDirective, AlertModule, IColumnFilterValue, PopoverModule } from '@coreui/angular-pro';
import { AppointmentResponse } from '../../../../../share/dto/response/appoiment-response';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { improveUILongId } from '../../../../../share/utils/id/id.utils';
import { ToastService } from '../../../../../share/ui/toast/toast.service';
import { MyToastModule } from "../../../../../share/ui/toast/toast.module";

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CardModule,
    RowComponent,
    ColComponent,
    SmartTableModule,
    SmartPaginationModule,
    CommonModule,
    SpinnerModule,
    AlignDirective,
    TemplateIdDirective,
    AlertModule,
    ButtonDirective,
    BadgeModule,
    ModalModule,
    FormsModule,
    FormSelectDirective,
    PopoverModule,
    MyToastModule,
],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  providers: [
    DatePipe, // Ensure DatePipe is provided
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    ToastService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentComponent implements OnInit, OnDestroy {
  // --- Inject Services ---
  private appointmentService = inject(AppointmentService);
  private snackbar = inject(SnackBarService);
  private cdr = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe); // Inject DatePipe
  improveUILongId = improveUILongId;

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  // --- Sửa lại tên cột mặc định ---
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'createdAt', state: 'desc' }); // Default sort mới nhất
  readonly filter$ = new BehaviorSubject<any>({});
  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly errorMessage$ = new Subject<string>();
  readonly #destroy$ = new Subject<boolean>();

  selectedAppointmentId: string = '';
  selectedStatus: string = '';
  reason: string = '';

  // --- Data Streams ---
  readonly apiParams$: Observable<any>;
  readonly props$: Observable<any>;
  data$: Observable<AppointmentResponse[]>;

  // --- Table Columns ---
  readonly columns: (IColumn | string)[] = [
    { key: 'id', label: 'ID' },
    { key: 'denId', label: 'Mã bác sĩ' },
    { key: 'patId', label: 'Mã bệnh nhân' },
    { key: 'assiId', label: 'Mã phụ tá' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'timeStart', label: 'TG bắt đầu' },
    { key: 'timeEnd', label: 'TG kết thúc' },
    { key: 'createdAt', label: 'TG tạo' }, // Key phải khớp với dữ liệu và sortFields$
    { key: 'interact', label: 'Thao tác', sorter: false, filter: false },
  ];

  // --- BehaviorSubject để giữ toàn bộ dữ liệu gốc từ service ---
  private allAppointmentsData$ = new BehaviorSubject<AppointmentResponse[]>([]);

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastService: ToastService
  ) {
    this.spinner.show();

    // Combine filter, pagination, sort
    this.apiParams$ = combineLatest([this.pagination$, this.sortFields$, this.filter$]).pipe(
      map(([pagination, sortFields, filter]) => ({
        page: pagination.page,
        size: pagination.size,
        sort: this.formatSortParam(sortFields),
        filter
      })),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.#destroy$)
    );

    this.props$ = combineLatest([this.pagination$, this.loading$, this.sortFields$, this.totalPages$]).pipe(
      map(([pagination, loading, sortFields, totalPages]) => ({
        activePage: pagination.page,
        itemsPerPage: pagination.size,
        loadingData: loading,
        sorterValue: sortFields,
        totalPages
      }))
    );

    // Gọi API mỗi khi filter, sort, page thay đổi
    this.data$ = this.apiParams$.pipe(
      tap(() => {
        this.loading$.next(true);
        this.errorMessage$.next('');
      }),
      switchMap((params) =>
        this.appointmentService.getPaginationAppointments(
          params.filter,
          params.page,
          params.size,
          params.sort
        ).pipe(
          map((response: any) => {
            const appointments = response.result?.content || [];
            this.totalPages$.next(response.result?.page?.totalPages || 1);
            return appointments.map((item: any) => ({
              ...item,
              createdAt: this.datePipe.transform(item.createdAt, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
            }));
          }),
          tap(() => {
            this.loading$.next(false);
            this.cdr.markForCheck();
          })
        )
      ),
      startWith([]),
      takeUntil(this.#destroy$)
    );
    this.spinner.hide();
  }

  ngOnInit(): void {
    console.log('AppointmentComponent initialized.');
    // No need to call spinner.hide() here if it's handled in the stream
  }

  ngOnDestroy(): void {
    this.#destroy$.next(true);
    this.#destroy$.complete();
  }

  // --- Event Handlers ---
  // --- Event Handlers ---
  handleActivePageChange(page: number): void {
    const currentPagination = this.pagination$.value;
    this.pagination$.next({ ...currentPagination, page: page });
  }

  handleItemsPerPageChange(size: number): void {
    const currentPagination = this.pagination$.value;
    this.pagination$.next({ ...currentPagination, size });
  }

  handleSorterValueChange(sorterValue: ISorterValue): void {
    this.sortFields$.next(sorterValue);
  }

  handleColumnFilterValueChange(columnFilterValue: any): void {
    let filterObj: any;
    if (Array.isArray(columnFilterValue)) {
      filterObj = { status : columnFilterValue };
    } else if (columnFilterValue && Array.isArray(columnFilterValue.status)) {
      filterObj = columnFilterValue;
    } else  {
      filterObj = columnFilterValue;
    }

    this.filter$.next(filterObj);
    // Reset về trang đầu tiên khi filter thay đổi
    const currentPagination = this.pagination$.value;
    if (currentPagination.page !== 1) {
      this.pagination$.next({ ...currentPagination, page: 1 });
    }
  }

  // --- Utility Methods ---
  private formatSortParam(sorter: ISorterValue): string {
    if (!sorter || !sorter.column || !sorter.state) {
      // --- Sử dụng giá trị mặc định đã sửa ---
      return 'createdAt,desc'; // Default sort mới nhất
    }
    return `${sorter.column},${sorter.state}`;
  }

  // --- Navigation Methods ---
  goToCreateAppointment() {
    this.router.navigate([ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.CREATE.fullPath]);
  }

  goToDetailAppointment(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.DETAIL.fullPath(id)]);
  }

  goToEditAppointment(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.EDIT.fullPath(id)]);
  }

  // --- UI Helpers ---
  getBadge(status: string) {
    // ... (keep existing getBadge logic) ...
    switch (status) {
      case 'confirmed': return 'info';
      case 'in_progress': return 'primary';
      case 'finished': return 'success';
      case 'cancelled': return 'danger';
      case 'not_show': return 'warning';
      default: return 'secondary';
    }
  }

  // --- Modal and Status Change ---
  openChangeStatusModal(id: string, status: string): void {
    this.selectedAppointmentId = id;
    this.selectedStatus = status;
    this.reason = '';
    // Logic to actually open the modal (e.g., using a boolean flag bound to c-modal visible property)
    // this.isModalVisible = true; // Assuming you have such a property
    this.cdr.markForCheck();
  }

  onChangeStatus(): void {
    this.spinner.show(); // Show spinner during status update
    this.appointmentService.updateStatusAppointment(this.selectedAppointmentId, this.selectedStatus, this.reason).subscribe({
      next: (response) => {
        this.snackbar.notifySuccess(response.message);

        // --- Cập nhật dữ liệu trong allAppointmentsData$ ---
        const currentAllData = this.allAppointmentsData$.value;
        const indexInAllData = currentAllData.findIndex((item) => item.id === this.selectedAppointmentId);

        if (indexInAllData !== -1) {
          // Tạo một bản sao của item để cập nhật (đảm bảo tính bất biến nếu cần)
          const updatedItem = {
            ...currentAllData[indexInAllData],
            status: this.selectedStatus
            // Cập nhật thêm reason hoặc các trường khác nếu API trả về
          };
          // Tạo một mảng mới với item đã cập nhật
          const newAllData = [
            ...currentAllData.slice(0, indexInAllData),
            updatedItem,
            ...currentAllData.slice(indexInAllData + 1)
          ];
          this.allAppointmentsData$.next(newAllData); // Phát ra dữ liệu mới
        } else {
          // Nếu không tìm thấy, có thể cần fetch lại toàn bộ để đảm bảo đồng bộ
          // Hoặc log lỗi
          console.warn(`Appointment with ID ${this.selectedAppointmentId} not found in local data after update.`);
          // Để đơn giản, bạn có thể re-fetch ở đây nếu muốn, nhưng lý tưởng là không cần
          // this.refreshAllData(); // Một hàm helper để gọi lại service
        }

        // --- Trigger data refresh ---
        // Easiest way with client-side data is to re-emit the source observable or manually update the local array
        // For simplicity, let's re-trigger the fetch (though inefficient for large datasets)
        // A better way would be to update the item in the 'allData' array before the map/slice
        const currentParams = this.pagination$.value;
        this.pagination$.next({ ...currentParams }); // Re-emit params to trigger data$ pipe again

        // Close modal logic
        // this.isModalVisible = false;
        this.spinner.hide();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.snackbar.notifyError(error.error?.message || 'Lỗi cập nhật trạng thái');
        console.error('Error updating appointment status:', error);
        this.spinner.hide();
        this.cdr.markForCheck();
      },
    });
  }

  goToPatientDetail(id: string): void {
    this.router.navigate([ROUTES.ADMIN.children.PATIENT.children.DETAIL.fullPath(id)]);
  }

  copyId(id: string) {
    navigator.clipboard.writeText(id);
    this.toastService.show({
      body: "Đã sao chép: " + id,
      autohide: true,
      delay: 1000,
      progress: true,
    });
  }
}
