import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, tap, takeUntil, startWith, distinctUntilChanged } from 'rxjs/operators';
import { AppointmentService } from '../../../../../core/services/appointment.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { AlignDirective, BadgeModule, ButtonDirective, CardModule, ColComponent, FormSelectDirective, ModalModule, RowComponent, SpinnerModule } from '@coreui/angular';
import { SmartTableModule, SmartPaginationModule, ISorterValue, IColumn, TemplateIdDirective, AlertModule, IColumnFilterValue } from '@coreui/angular-pro';
import { AppointmentResponse } from '../../../../../share/dto/response/appoiment-response';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

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
    FormSelectDirective
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentComponent implements OnInit, OnDestroy {

  private appointmentService = inject(AppointmentService);
  private snackbar = inject(SnackBarService);
  private cdr = inject(ChangeDetectorRef);

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'appointmentDate', state: 'asc' });
  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly errorMessage$ = new Subject<string>();
  readonly #destroy$ = new Subject<boolean>();

  selectedAppointmentId: string = ''; // Lưu trữ ID của lịch hẹn được chọn
  selectedStatus: string = ''; // Lưu trữ trạng thái hiện tại của lịch hẹn được chọn
  reason: string = ''; // Lưu trữ lý do hủy lịch hẹn

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
    { key: 'createdAt', label: 'TG tạo' },
    { key: 'interact', label: 'Thao tác', sorter: false, filter: false },
  ];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.spinner.show(); // Show spinner when component is initialized
    // Combine state for API parameters
    this.apiParams$ = combineLatest([this.pagination$, this.sortFields$]).pipe(
      map(([pagination, sortFields]) => ({
        page: pagination.page,
        size: pagination.size,
        sort: this.formatSortParam(sortFields)
      })),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.#destroy$)
    );

    // Combine state for template props
    this.props$ = combineLatest([this.pagination$, this.loading$, this.sortFields$, this.totalPages$]).pipe(
      map(([pagination, loading, sortFields, totalPages]) => ({
        activePage: pagination.page,
        itemsPerPage: pagination.size,
        loadingData: loading,
        sorterValue: sortFields,
        totalPages
      }))
    );

    // Fetch data based on API parameters
    this.data$ = combineLatest([this.apiParams$, this.appointmentService.getAllAppointments()]).pipe(
      tap(() => {
        this.loading$.next(true);
        this.errorMessage$.next('');
      }),
      map(([params, response]) => {
        // Đảm bảo response.result là một mảng
        const data = Array.isArray(response?.result) ? response.result : [];

        // Định dạng dữ liệu trước khi truyền vào bảng
        const formattedData = data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString('vi-VN', { hour12: false }),
          timeStart: new Date(item.timeStart).toLocaleString('vi-VN', { hour12: false }),
          timeEnd: new Date(item.timeEnd).toLocaleString('vi-VN', { hour12: false }),
        }));

        // Lọc, sắp xếp và phân trang dữ liệu cục bộ
        let filteredData = [...formattedData];

        // Áp dụng sắp xếp
        if (params.sort) {
          const [key, direction] = params.sort.split(',');
          filteredData.sort((a: any, b: any) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
          });
        }

        // Áp dụng phân trang
        const startIndex = (params.page - 1) * params.size;
        const endIndex = startIndex + params.size;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        // Cập nhật tổng số trang
        const totalPages = Math.ceil(filteredData.length / params.size);
        this.totalPages$.next(totalPages);

        this.loading$.next(false);
        this.cdr.markForCheck();

        return paginatedData;
      }),
      startWith([]),
      takeUntil(this.#destroy$)
    );
    this.spinner.hide(); // Hide spinner when data is loaded
  }

  ngOnInit(): void {
    console.log('AppointmentComponent initialized.');
  }

  ngOnDestroy(): void {
    this.#destroy$.next(true);
    this.#destroy$.complete();
  }

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

  // --- Utility Methods ---
  private formatSortParam(sorter: ISorterValue): string {
    if (!sorter || !sorter.column || !sorter.state) {
      return 'appointmentDate,asc'; // Default sort
    }
    return `${sorter.column},${sorter.state}`;
  }

  goToCreateAppointment() {
    this.router.navigate([ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.CREATE.fullPath]);
  }

  goToDetailAppointment(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.DETAIL.fullPath(id)]);
  }

  goToEditAppointment(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.children.EDIT.fullPath(id)]);
  }

  getBadge(status: string) {
    switch (status) {
      case 'confirmed':
        return 'info'; // Màu xanh lá cho trạng thái đã xác nhận
      case 'in_progress':
        return 'primary'; // Màu xanh dương cho trạng thái đang tiến hành
      case 'finished':
        return 'success'; // Màu xanh nhạt cho trạng thái đã hoàn thành
      case 'cancelled':
        return 'danger'; // Màu đỏ cho trạng thái đã hủy
      case 'not_show':
        return 'warning'; // Màu vàng cho trạng thái không đến
      default:
        return 'secondary'; // Màu xám cho trạng thái chưa xác định
    }
  }

  openChangeStatusModal(id: string, status: string): void {
    this.selectedAppointmentId = id; // Gán ID của lịch hẹn được chọn
    this.selectedStatus = status; // Gán trạng thái hiện tại của lịch hẹn
    this.reason = '';
  }

  onChangeStatus(): void {
    // Gửi dữ liệu đến API hoặc xử lý logic
    this.appointmentService.updateStatusAppointment(this.selectedAppointmentId, this.selectedStatus, this.reason).subscribe({
      next: (response) => {
        this.snackbar.notifySuccess(response.message);
        this.data$ = this.data$.pipe(
          map((appointments) => {
            return appointments.map((appointment) => {
              if (appointment.id === this.selectedAppointmentId) {
                return { ...appointment, status: this.selectedStatus }; // Cập nhật trạng thái của lịch hẹn đã chọn
              }
              return appointment;
            });
          }
        ));
        this.cdr.markForCheck(); // Đảm bảo rằng thay đổi được phát hiện
      },
      error: (error) => {
        this.snackbar.notifyError(error.error.message);
        console.error('Error updating appointment status:', error.error);
      },
    });
  }
}
