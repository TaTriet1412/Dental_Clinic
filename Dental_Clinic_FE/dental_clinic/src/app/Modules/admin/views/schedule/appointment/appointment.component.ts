import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, of } from 'rxjs'; // Import 'of'
import { map, switchMap, tap, takeUntil, startWith, distinctUntilChanged, catchError } from 'rxjs/operators'; // Import catchError
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
    DatePipe, // Ensure DatePipe is provided
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentComponent implements OnInit, OnDestroy {

  private appointmentService = inject(AppointmentService);
  private snackbar = inject(SnackBarService);
  private cdr = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe); // Inject DatePipe

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  // --- Sửa lại tên cột mặc định ---
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'createdAt', state: 'desc' }); // Default sort mới nhất
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

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.spinner.show();
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
    this.data$ = combineLatest([
        this.apiParams$,
        // Fetch all data once
        this.appointmentService.getAllAppointments().pipe(
            map(response => Array.isArray(response?.result) ? response.result : []), // Get the raw data array
            // --- Lưu trữ Date gốc ---
            map(data => data.map((item:any) => ({
                ...item,
                _original_createdAt: new Date(item.createdAt),
                _original_timeStart: new Date(item.timeStart),
                _original_timeEnd: new Date(item.timeEnd)
            }))),
            catchError(err => { // Handle potential errors during initial fetch
                console.error("Error fetching initial appointments:", err);
                this.errorMessage$.next(err?.error?.message || 'Lỗi tải danh sách lịch hẹn');
                this.loading$.next(false);
                this.spinner.hide();
                return of([]); // Return empty array on error
            })
        )
    ]).pipe(
      tap(() => {
        // Reset loading/error only when params change if needed, or keep it simple
        this.loading$.next(true);
        this.errorMessage$.next('');
        // spinner.show() might be better placed before the combineLatest if it should show every time params change
      }),
      map(([params, allData]) => { // allData now contains _original_... dates

        let processedData = [...allData]; // Work with the full dataset

        // --- Áp dụng sắp xếp trên dữ liệu gốc ---
        if (params.sort) {
          const [key, direction] = params.sort.split(',');
          // --- Sắp xếp dựa trên đối tượng Date gốc ---
          const sortKeyOriginal = `_original_${key}`; // e.g., _original_createdAt

          // Check if the original date key exists before sorting
          if (processedData.length > 0 && processedData[0].hasOwnProperty(sortKeyOriginal)) {
              processedData.sort((a: any, b: any) => {
                  const dateA = a[sortKeyOriginal]?.getTime();
                  const dateB = b[sortKeyOriginal]?.getTime();

                  // Handle potential invalid dates
                  if (isNaN(dateA) && isNaN(dateB)) return 0;
                  if (isNaN(dateA)) return 1; // Put invalid dates at the end
                  if (isNaN(dateB)) return -1;

                  if (dateA < dateB) return direction === 'asc' ? -1 : 1;
                  if (dateA > dateB) return direction === 'asc' ? 1 : -1;
                  return 0;
              });
          } else if (processedData.length > 0 && processedData[0].hasOwnProperty(key)) {
              // Fallback to sorting other non-date columns if original date key doesn't exist
              processedData.sort((a: any, b: any) => {
                  if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                  if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
                  return 0;
              });
          }
        }

        // --- Định dạng ngày tháng *sau khi* sắp xếp ---
        const formattedData = processedData.map((item: any) => ({
          ...item,
          // Sử dụng DatePipe để định dạng
          createdAt: this.datePipe.transform(item._original_createdAt, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
          timeStart: this.datePipe.transform(item._original_timeStart, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
          timeEnd: this.datePipe.transform(item._original_timeEnd, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
        }));

        // Áp dụng phân trang trên dữ liệu đã sắp xếp và định dạng
        const startIndex = (params.page - 1) * params.size;
        const endIndex = startIndex + params.size;
        const paginatedData = formattedData.slice(startIndex, endIndex);

        // Cập nhật tổng số trang dựa trên toàn bộ dữ liệu đã xử lý
        const totalPages = Math.ceil(formattedData.length / params.size);
        this.totalPages$.next(totalPages);

        this.loading$.next(false);
        this.cdr.markForCheck(); // Mark for check after async operations

        return paginatedData;
      }),
      startWith([]), // Initial empty value before data loads
      takeUntil(this.#destroy$)
    );
    // Consider moving spinner.hide() inside the final tap/map of the data$ stream
    this.spinner.hide(); // Might hide too early if initial fetch is slow
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
  handleActivePageChange(page: number): void {
    const currentPagination = this.pagination$.value;
    this.pagination$.next({ ...currentPagination, page: page });
  }

  handleItemsPerPageChange(size: number): void {
    const currentPagination = this.pagination$.value;
    // Reset to page 1 when items per page changes
    this.pagination$.next({ ...currentPagination, size, page: 1 });
  }

  handleSorterValueChange(sorterValue: ISorterValue): void {
    // Reset to page 1 when sorting changes
    const currentPagination = this.pagination$.value;
    this.pagination$.next({ ...currentPagination, page: 1 });
    this.sortFields$.next(sorterValue);
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
        // --- Trigger data refresh ---
        // Easiest way with client-side data is to re-emit the source observable or manually update the local array
        // For simplicity, let's re-trigger the fetch (though inefficient for large datasets)
        // A better way would be to update the item in the 'allData' array before the map/slice
        const currentParams = this.pagination$.value;
        this.pagination$.next({...currentParams}); // Re-emit params to trigger data$ pipe again

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
}
