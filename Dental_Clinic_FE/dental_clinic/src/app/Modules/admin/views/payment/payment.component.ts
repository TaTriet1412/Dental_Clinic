import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlignDirective, BadgeModule, ButtonDirective, CardModule, ColComponent, ModalModule, RowComponent, SpinnerModule } from '@coreui/angular';
import { AlertModule, DateRangePickerModule, FormControlDirective, IColumn, ISorterValue, MultiSelectModule, SmartPaginationModule, SmartTableModule, TemplateIdDirective } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ROUTES } from '../../../../core/constants/routes.constant';
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { PaymentService } from '../../../../core/services/payment.service';
import { endOfDay, format, startOfDay } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { translateStatus } from '../../../../share/utils/translator/payment-translator.utils';
import { getPaymentStatusBadge } from '../../../../share/utils/badge/payment-badge.utils';

@Component({
  selector: 'app-payment',
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
    DateRangePickerModule,
    MultiSelectModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit, OnDestroy {
  // Imports functions
  translateStatus = translateStatus;
  getPaymentStatusBadge = getPaymentStatusBadge;

  // Inject services
  private snackbar = inject(SnackBarService);
  private cdr = inject(ChangeDetectorRef);

  // Variable
  private _columnFilterValue: any = {};
  statusList: string[] = [];
  selectedStatus: string[] = [];

  // --- Column Filter Value ---
  get columnFilterValue() {
    return this._columnFilterValue;
  }

  set columnFilterValue(value: any) {
    this._columnFilterValue = value;
    this.handleColumnFilterValueChange(value);
  }

  // --- Set/Get Date ---
  public calendarDate: Date = new Date();
  private _endDate: Date | null = new Date();
  private _startDate: Date | null = new Date(2020, 0, 1, 0, 0, 0); // Default start date

  set startDate(value) {
    this._startDate = value;
    if (this.endDate) {
      this.handleDateRangeChange();
    }
  }

  get startDate() {
    return this._startDate;
  }

  set endDate(value) {
    this._endDate = value;
    this.handleDateRangeChange();
  }

  private handleDateRangeChange() {
    const columnFilterValue = { ...this._columnFilterValue };
    if (this.startDate && this.endDate) {
      const fromDate = startOfDay(this.startDate);
      const toDate = endOfDay(this.endDate);

      const filterFunction = (item: any) => {
        const date = new Date(item);
        return date >= fromDate && date <= toDate;
      }

      this._columnFilterValue = {
        ...columnFilterValue,
        startCreatedAt: format(fromDate.toISOString(), "yyyy-MM-dd'T'HH:mm:ss"),
        endCreatedAt: format(toDate.toISOString(), "yyyy-MM-dd'T'HH:mm:ss"),
      };
      return;
    }

    delete columnFilterValue._original_createdAt;
    this._columnFilterValue = { ...columnFilterValue };
  }

  get endDate() {
    return this._endDate;
  }

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'createdAt', state: 'desc' });
  readonly filter$ = new BehaviorSubject<any>({});
  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly errorMessage$ = new Subject<string>();
  readonly #destroy$ = new Subject<boolean>();

  // --- Data Streams ---
  readonly apiParams$: Observable<any>;
  readonly props$: Observable<any>;
  data$: Observable<any[]>;

  // --- Table Columns ---
  readonly columns: (IColumn | string)[] = [
    { key: 'id', label: 'ID' },
    { key: 'totalPrice', label: 'Tổng giá' },
    { key: 'prescriptionPrice', label: 'Giá toa thuốc' },
    { key: 'servicesTotalPrice', label: 'Giá dịch vụ' },
    { key: 'createdAt', label: 'TG tạo' },
    { key: 'note', label: 'Ghi chú' },
    { key: 'status', label: 'Trạng thái', sorter: false },
    { key: 'interact', label: 'Thao tác', sorter: false, filter: false },
  ];

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
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
        this.paymentService.getPaginationBills(
          params.filter,
          params.page,
          params.size,
          params.sort
        ).pipe(
          map((response: any) => {
            // Lấy danh sách hóa đơn từ response.result.content (chuẩn Page Spring Boot)
            const bills = response.result?.content || [];
            this.totalPages$.next(response.result?.totalPages || 1);
            return bills.map((item: any) => ({
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
    this.paymentService.getBillStatusList().subscribe({
      next: (response: any) => {
        this.statusList = response.result || [];
        this.cdr.markForCheck();
      }
      ,
      error: (error: any) => {
        this.snackbar.notifyError(error?.error?.message || 'Lỗi khi lấy danh sách trạng thái');
      }
    });
    console.log('BillComponent initialized.');
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

  handleColumnFilterValueChange(columnFilterValue: any): void {
    let filterObj: any;
    if (Array.isArray(columnFilterValue)) {
      filterObj = { status: columnFilterValue };
    } else if (columnFilterValue && Array.isArray(columnFilterValue.status)) {
      filterObj = columnFilterValue;
    } else {
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
      // --- Đảm bảo default sort key khớp với key dùng trong logic sắp xếp ---
      return 'createdAt,desc'; // Default sort
    }
    return `${sorter.column},${sorter.state}`;
  }

  goToCreateBill() {
    this.router.navigate([ROUTES.ADMIN.children.PAYMENT.children.CREATE.fullPath]);
  }

  goToDetailBill(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.PAYMENT.children.DETAIL.fullPath(id)]);
  }

  goToEditBill(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.PAYMENT.children.EDIT.fullPath(id)]);
  }

  cancelBill(billId: number) {
    if (confirm('Bạn có chắc muốn hủy hóa đơn này?')) {
      this.paymentService.cancelBill(billId).subscribe({
        next: (response) => {
          this.snackbar.notifySuccess(response.message);
          // --- Cần trigger fetch lại dữ liệu hoặc cập nhật local state đúng cách ---
          // Đơn giản nhất là fetch lại, nhưng sẽ mất trạng thái sắp xếp/trang hiện tại nếu không quản lý cẩn thận
          // Hoặc cập nhật is_deleted trong mảng dữ liệu gốc và re-pipe
          // Ví dụ cập nhật local (cần đảm bảo data$ re-emit):
          this.data$ = this.data$.pipe(
            map(currentPageData => currentPageData.map(p =>
              p.id === billId ? { ...p, status: 'cancelled' } : p // Cập nhật trạng thái
            ))
          );
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.snackbar.notifyError(error?.error?.message || 'Lỗi khi hủy hóa đơn');
        }
      });
    }
  }
}