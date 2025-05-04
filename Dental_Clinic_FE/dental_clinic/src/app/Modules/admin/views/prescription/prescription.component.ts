import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlignDirective, BadgeModule, ButtonDirective, CardModule, ColComponent, ModalModule, RowComponent, SpinnerModule } from '@coreui/angular';
import { AlertModule, IColumn, ISorterValue, SmartPaginationModule, SmartTableModule, TemplateIdDirective } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { ROUTES } from '../../../../core/constants/routes.constant';
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { PrescriptionService } from '../../../../core/services/prescription.service';

@Component({
  selector: 'app-prescription',
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
    FormsModule
  ],
  templateUrl: './prescription.component.html',
  styleUrl: './prescription.component.scss',
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrescriptionComponent implements OnInit, OnDestroy {

  private snackbar = inject(SnackBarService);
  private cdr = inject(ChangeDetectorRef);

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'created_at', state: 'desc' });
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
    { key: 'pat_id', label: 'ID bệnh nhân' },
    { key: 'den_id', label: 'ID nha sĩ' },
    { key: 'bill_id', label: 'ID hóa đơn' },
    { key: 'note', label: 'Ghi chú' },
    { key: 'total_price', label: 'Tổng giá' },
    { key: 'created_at', label: 'TG tạo' },
    { key: 'interact', label: 'Thao tác', sorter: false, filter: false },
  ];

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe // Inject DatePipe if not already done implicitly by providers
  ) {
    this.spinner.show();
    this.apiParams$ = combineLatest([this.pagination$, this.sortFields$]).pipe(
      map(([pagination, sortFields]) => ({
        page: pagination.page,
        size: pagination.size,
        sort: this.formatSortParam(sortFields)
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

    // Fetch data based on API parameters
    this.data$ = combineLatest([
      this.apiParams$,
      // Fetch all data once
      this.prescriptionService.getAllPrescription().pipe(
        map(response => Array.isArray(response?.result) ? response.result : []), // Get the raw data array
        // Store original date before formatting if needed, or use it directly in sort
        map(data => data.map((item: { created_at: string | number | Date; }) => ({ ...item, _original_created_at: new Date(item.created_at) }))) // Store original Date
      )
    ]).pipe(
      tap(() => {
        this.loading$.next(true);
        this.errorMessage$.next('');
      }),
      map(([params, allData]) => { // allData now contains _original_created_at

        let processedData = [...allData]; // Work with the full dataset

        // Áp dụng sắp xếp trên dữ liệu gốc
        if (params.sort) {
          const [key, direction] = params.sort.split(',');
          if (key === 'created_at') { // Specific handling for date sorting
            processedData.sort((a: any, b: any) => {
              // --- Sắp xếp dựa trên đối tượng Date gốc ---
              const dateA = a._original_created_at.getTime();
              const dateB = b._original_created_at.getTime();
              if (dateA < dateB) return direction === 'asc' ? -1 : 1;
              if (dateA > dateB) return direction === 'asc' ? 1 : -1;
              return 0;
            });
          } else {
            // Sắp xếp các cột khác (nếu có)
            processedData.sort((a: any, b: any) => {
              if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
              if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
              return 0;
            });
          }
        }

        // Định dạng ngày tháng *sau khi* sắp xếp
        const formattedData = processedData.map((item: any) => ({
          ...item,
          // Sử dụng DatePipe hoặc toLocaleString ở đây
          created_at: this.datePipe.transform(item._original_created_at, 'dd/MM/yyyy, HH:mm:ss', 'vi-VN') || '',
          // Hoặc: created_at: item._original_created_at.toLocaleString('vi-VN', { hour12: false }),
        }));


        // Áp dụng phân trang trên dữ liệu đã sắp xếp và định dạng
        const startIndex = (params.page - 1) * params.size;
        const endIndex = startIndex + params.size;
        const paginatedData = formattedData.slice(startIndex, endIndex);

        // Cập nhật tổng số trang
        const totalPages = Math.ceil(formattedData.length / params.size);
        this.totalPages$.next(totalPages);

        this.loading$.next(false);
        this.cdr.markForCheck();

        return paginatedData;
      }),
      startWith([]),
      takeUntil(this.#destroy$)
    );
    this.spinner.hide();
  }

  ngOnInit(): void {
    console.log('PrescriptionComponent initialized.');
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
      // --- Đảm bảo default sort key khớp với key dùng trong logic sắp xếp ---
      return 'created_at,desc'; // Default sort
    }
    return `${sorter.column},${sorter.state}`;
  }

  goToCreatePrescription() {
    this.router.navigate([ROUTES.ADMIN.children.PRESCRIPTION.children.CREATE.fullPath]);
  }

  goToDetailPrescription(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.PRESCRIPTION.children.DETAIL.fullPath(id)]);
  }

  goToEditPrescription(id: string) {
    this.router.navigate([ROUTES.ADMIN.children.PRESCRIPTION.children.EDIT.fullPath(id)]);
  }

  deletePrescription(prescriptionId: string) {
    this.prescriptionService.deletePrescription(prescriptionId).subscribe({
      next: (response) => {
        this.snackbar.notifySuccess(response.message);
        // --- Cần trigger fetch lại dữ liệu hoặc cập nhật local state đúng cách ---
        // Đơn giản nhất là fetch lại, nhưng sẽ mất trạng thái sắp xếp/trang hiện tại nếu không quản lý cẩn thận
        // Hoặc cập nhật is_deleted trong mảng dữ liệu gốc và re-pipe
        // Ví dụ cập nhật local (cần đảm bảo data$ re-emit):
        this.data$ = this.data$.pipe(
          map(currentPageData => currentPageData.map(p =>
            p.id === prescriptionId ? { ...p, is_deleted: true } : p // Cập nhật trạng thái
          ))
        );
        // Lưu ý: Cách cập nhật local này chỉ ảnh hưởng trang hiện tại.
        // Để cập nhật toàn bộ, cần tác động vào nguồn dữ liệu gốc trước khi map/slice.
        // Hoặc tốt hơn là gọi lại API để lấy dữ liệu mới nhất sau khi xóa.
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.snackbar.notifyError(error?.error?.message || 'Lỗi khi xóa');
      }
    });
  }
}