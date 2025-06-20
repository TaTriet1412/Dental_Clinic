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
    PopoverModule
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
  ) {
    this.spinner.show();

    // --- Lấy dữ liệu gốc một lần và đưa vào allAppointmentsData$ ---
    this.appointmentService.getAllAppointments().pipe(
      map(response => Array.isArray(response?.result) ? response.result : []),
      map(data => data.map((item: any) => ({
        ...item,
        _original_createdAt: new Date(item.createdAt),
        _original_timeStart: new Date(item.timeStart),
        _original_timeEnd: new Date(item.timeEnd)
      }))),
      catchError(err => {
        console.error("Error fetching initial appointments:", err);
        this.errorMessage$.next(err?.error?.message || 'Lỗi tải danh sách lịch hẹn');
        return of([]);
      }),
      takeUntil(this.#destroy$) // Hủy khi component destroy
    ).subscribe(data => {
      this.allAppointmentsData$.next(data); // Đưa dữ liệu vào BehaviorSubject
      this.loading$.next(false); // Dữ liệu gốc đã tải xong
      this.spinner.hide(); // Ẩn spinner sau khi dữ liệu gốc đã tải
    });

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
        loadingData: loading, // Sẽ là true ban đầu, false sau khi allAppointmentsData$ có giá trị
        sorterValue: sortFields,
        totalPages
      }))
    );

    // --- data$ giờ sẽ lấy từ allAppointmentsData$ và các params ---
    this.data$ = combineLatest([
      this.apiParams$,
      this.allAppointmentsData$ // Sử dụng BehaviorSubject chứa dữ liệu gốc
    ]).pipe(
      tap(([params, allData]) => { // Thêm allData vào tap để debug nếu cần
        // Nếu allData rỗng (chưa tải xong), không cần làm gì hoặc hiển thị loading
        if (allData.length === 0 && this.loading$.value) {
          // Có thể đặt loading$.next(true) ở đây nếu muốn spinner cho mỗi lần params thay đổi
        } else if (allData.length > 0 && this.loading$.value) {
          // this.loading$.next(false); // Dữ liệu đã có, không còn loading cho việc xử lý client-side
        }
        this.errorMessage$.next('');
      }),
      map(([params, allData]) => {
        if (allData.length === 0) { // Nếu chưa có dữ liệu gốc, trả về mảng rỗng
          this.totalPages$.next(0);
          this.loading$.next(false); // Đảm bảo loading là false nếu không có data
          return [];
        }
        // this.loading$.next(true); // Bắt đầu xử lý client-side

        let processedData = [...allData];

        // --- Áp dụng sắp xếp trên dữ liệu gốc ---
        // ... (logic sắp xếp giữ nguyên) ...
        if (params.sort) {
          const [key, direction] = params.sort.split(',');
          const sortKeyOriginal = `_original_${key}`;

          if (processedData.length > 0 && processedData[0].hasOwnProperty(sortKeyOriginal)) {
            processedData.sort((a: any, b: any) => {
              const dateA = a[sortKeyOriginal]?.getTime();
              const dateB = b[sortKeyOriginal]?.getTime();
              if (isNaN(dateA) && isNaN(dateB)) return 0;
              if (isNaN(dateA)) return 1;
              if (isNaN(dateB)) return -1;
              if (dateA < dateB) return direction === 'asc' ? -1 : 1;
              if (dateA > dateB) return direction === 'asc' ? 1 : -1;
              return 0;
            });
          } else if (processedData.length > 0 && processedData[0].hasOwnProperty(key)) {
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
          createdAt: this.datePipe.transform(item._original_createdAt, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
          timeStart: this.datePipe.transform(item._original_timeStart, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
          timeEnd: this.datePipe.transform(item._original_timeEnd, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
        }));

        const startIndex = (params.page - 1) * params.size;
        const endIndex = startIndex + params.size;
        const paginatedData = formattedData.slice(startIndex, endIndex);

        const totalPages = Math.ceil(formattedData.length / params.size);
        this.totalPages$.next(totalPages);

        // this.loading$.next(false); // Kết thúc xử lý client-side
        this.cdr.markForCheck();
        return paginatedData;
      }),
      startWith([]),
      takeUntil(this.#destroy$)
    );
    // Bỏ spinner.hide() ở đây vì nó được xử lý sau khi allAppointmentsData$ nhận dữ liệu
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
  }
}
