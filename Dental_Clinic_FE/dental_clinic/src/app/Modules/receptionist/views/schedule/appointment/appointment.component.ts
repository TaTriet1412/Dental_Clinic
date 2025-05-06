import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, of } from 'rxjs';
import { map, switchMap, tap, takeUntil, startWith, distinctUntilChanged, catchError } from 'rxjs/operators';
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
  private datePipe = inject(DatePipe);

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'createdAt', state: 'desc' });
  readonly loading$ = new BehaviorSubject<boolean>(true); // Initial loading state
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly errorMessage$ = new Subject<string>();
  readonly #destroy$ = new Subject<boolean>();

  selectedAppointmentId: string = '';
  selectedStatus: string = '';
  reason: string = '';
  // isModalVisible: boolean = false; // Thêm biến này nếu bạn dùng c-modal với *ngIf

  // --- BehaviorSubject để giữ toàn bộ dữ liệu gốc từ service ---
  private allAppointmentsData$ = new BehaviorSubject<AppointmentResponse[]>([]);

  // --- Data Streams ---
  readonly apiParams$: Observable<any>; // Chỉ dùng cho params, không trực tiếp fetch
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
    this.spinner.show(); // Hiển thị spinner khi component bắt đầu khởi tạo

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
        return of([]); // Trả về mảng rỗng nếu có lỗi
      }),
      takeUntil(this.#destroy$) // Hủy khi component destroy
    ).subscribe({
      next: (data) => {
        this.allAppointmentsData$.next(data); // Đưa dữ liệu vào BehaviorSubject
        this.loading$.next(false); // Dữ liệu gốc đã tải xong
        this.spinner.hide(); // Ẩn spinner sau khi dữ liệu gốc đã tải
        this.cdr.markForCheck();
      },
      error: () => { // Xử lý lỗi ở đây nếu catchError không re-throw
        this.loading$.next(false);
        this.spinner.hide();
        this.cdr.markForCheck();
      }
    });

    // Combine state for API parameters (chỉ dùng để tính toán, không trigger fetch)
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

    // --- data$ giờ sẽ lấy từ allAppointmentsData$ và các params ---
    this.data$ = combineLatest([
        this.apiParams$, // Params for pagination and sorting
        this.allAppointmentsData$ // Source of all data
    ]).pipe(
      map(([params, allData]) => {
        if (allData.length === 0 && this.loading$.value) { // Nếu chưa có dữ liệu gốc và đang loading
            return []; // Trả về mảng rỗng, props$.loadingData sẽ là true
        }
        // Nếu allData rỗng nhưng không phải loading ban đầu (ví dụ: service trả về rỗng)
        if (allData.length === 0 && !this.loading$.value) {
            this.totalPages$.next(0);
            return [];
        }

        let processedData = [...allData];

        // --- Áp dụng sắp xếp trên dữ liệu gốc ---
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

        // Không cần set loading$ ở đây nữa vì nó phản ánh trạng thái tải dữ liệu gốc
        this.cdr.markForCheck();
        return paginatedData;
      }),
      startWith([]),
      takeUntil(this.#destroy$)
    );
  }

  ngOnInit(): void {
    // console.log('AppointmentComponent (Receptionist) initialized.');
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
    this.pagination$.next({ page: 1, size }); // Reset về trang 1
  }

  handleSorterValueChange(sorterValue: ISorterValue): void {
    this.pagination$.next({ ...this.pagination$.value, page: 1 }); // Reset về trang 1
    this.sortFields$.next(sorterValue);
  }

  // --- Utility Methods ---
  private formatSortParam(sorter: ISorterValue): string {
    if (!sorter || !sorter.column || !sorter.state) {
      return 'createdAt,desc';
    }
    return `${sorter.column},${sorter.state}`;
  }

  // --- Navigation Methods ---
  goToCreateAppointment() {
    this.router.navigate([ROUTES.RECEPTIONIST.children.SCHEDULE.children.APPOINTMENT.children.CREATE.fullPath]);
  }

  goToDetailAppointment(id: string) {
    this.router.navigate([ROUTES.RECEPTIONIST.children.SCHEDULE.children.APPOINTMENT.children.DETAIL.fullPath(id)]);
  }

  goToEditAppointment(id: string) {
    this.router.navigate([ROUTES.RECEPTIONIST.children.SCHEDULE.children.APPOINTMENT.children.EDIT.fullPath(id)]);
  }

  // --- UI Helpers ---
  getBadge(status: string) {
    switch (status?.toLowerCase()) { // Thêm toLowerCase() để an toàn
      case 'confirmed': return 'info';
      case 'in_progress': return 'primary';
      case 'finished': return 'success';
      case 'cancelled': return 'danger';
      case 'not_show': return 'warning';
      default: return 'secondary';
    }
  }

  // --- Modal and Status Change ---
  openChangeStatusModal(id: string, currentStatus: string): void {
    this.selectedAppointmentId = id;
    // Không gán selectedStatus ở đây, để người dùng chọn từ dropdown trong modal
    this.selectedStatus = currentStatus; // Hoặc gán nếu dropdown nên có giá trị mặc định là status hiện tại
    this.reason = '';
    // this.isModalVisible = true; // Mở modal
    this.cdr.markForCheck();
  }

  onChangeStatus(): void {
    if (!this.selectedAppointmentId || !this.selectedStatus) {
        this.snackbar.notifyError('Vui lòng chọn trạng thái hợp lệ.');
        return;
    }
    this.spinner.show();
    this.appointmentService.updateStatusAppointment(this.selectedAppointmentId, this.selectedStatus, this.reason).subscribe({
      next: (response) => {
        this.snackbar.notifySuccess(response.message);

        // --- Cập nhật dữ liệu trong allAppointmentsData$ ---
        const currentAllData = this.allAppointmentsData$.value;
        const indexInAllData = currentAllData.findIndex((item) => item.id === this.selectedAppointmentId);

        if (indexInAllData !== -1) {
          const updatedItem = {
            ...currentAllData[indexInAllData],
            status: this.selectedStatus,
            // Cập nhật thêm reason hoặc các trường khác nếu API trả về và bạn muốn hiển thị
            // Ví dụ: reason: this.reason (nếu API trả về reason đã lưu)
          };
          const newAllData = [
            ...currentAllData.slice(0, indexInAllData),
            updatedItem,
            ...currentAllData.slice(indexInAllData + 1)
          ];
          this.allAppointmentsData$.next(newAllData); // Phát ra dữ liệu mới
        } else {
          console.warn(`Appointment with ID ${this.selectedAppointmentId} not found in local data after update.`);
          // Optionally, trigger a full refresh if item not found, though ideally it should be there.
          // this.refreshAllDataFromServer();
        }

        // this.isModalVisible = false; // Đóng modal
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

  // Optional: Helper to re-fetch all data from server if needed
  // private refreshAllDataFromServer(): void {
  //   this.loading$.next(true);
  //   this.spinner.show();
  //   this.appointmentService.getAllAppointments().pipe(
  //     map(response => Array.isArray(response?.result) ? response.result : []),
  //     map(data => data.map((item: any) => ({ /* ... map to original dates ... */ }))),
  //     catchError(err => { /* ... error handling ... */ return of([]); }),
  //     takeUntil(this.#destroy$)
  //   ).subscribe(data => {
  //     this.allAppointmentsData$.next(data);
  //     this.loading$.next(false);
  //     this.spinner.hide();
  //     this.cdr.markForCheck();
  //   });
  // }
}
