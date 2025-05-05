import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, tap, takeUntil, startWith, distinctUntilChanged, debounceTime } from 'rxjs/operators'; // Import debounceTime
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { AlignDirective, BadgeModule, ButtonDirective, CardModule, ColComponent, FormSelectDirective, ModalModule, RowComponent, SpinnerModule } from '@coreui/angular';
import { SmartTableModule, SmartPaginationModule, ISorterValue, IColumn, TemplateIdDirective, AlertModule, IColumnFilterValue } from '@coreui/angular-pro';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../../../core/services/faculty.service';
import { FacultyResponse } from '../../../../share/dto/response/faculty-response';

@Component({
  selector: 'app-faculty',
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
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.scss',
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacultyComponent implements OnInit, OnDestroy {

  private snackbar = inject(SnackBarService);
  private cdr = inject(ChangeDetectorRef);

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'createdAt', state: 'asc' });
  // --- Thêm State cho Bộ lọc ---
  readonly filterValues$ = new BehaviorSubject<{ [key: string]: string }>({});
  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly errorMessage$ = new Subject<string>();
  readonly #destroy$ = new Subject<boolean>();

  // --- Data Streams ---
  // apiParams$ không cần thay đổi nếu chỉ lọc client-side
  readonly props$: Observable<any>;
  data$: Observable<FacultyResponse[]>;

  // --- Table Columns ---
  readonly columns: (IColumn | string)[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên khoa' },
    { key: 'description', label: 'Mô tả' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'SĐT' },
    { key: 'createdAt', label: 'TG tạo' },
    { key: 'interact', label: 'Thao tác', sorter: false, filter: false },
  ];
  apiParams$: Observable<{ page: number; size: number; sort: string; }>;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private facultyService: FacultyService,
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

    // Combine state for template props (thêm filterValues nếu cần bind ngược lại table)
    this.props$ = combineLatest([this.pagination$, this.loading$, this.sortFields$, this.totalPages$, this.filterValues$]).pipe(
      map(([pagination, loading, sortFields, totalPages, filterValues]) => ({
        activePage: pagination.page,
        itemsPerPage: pagination.size,
        loadingData: loading,
        sorterValue: sortFields,
        totalPages,
        columnFilterValue: filterValues
      }))
    );

    // --- Cập nhật data$ pipeline ---
    this.data$ = combineLatest([
      this.pagination$,
      this.sortFields$,
      this.filterValues$.pipe(debounceTime(300)), // Thêm debounceTime để tránh lọc quá thường xuyên
      this.facultyService.getAllFaculty().pipe(
        map(response => {
          const data = Array.isArray(response?.result) ? response.result : [];
          return data.map((item: any) => ({
            ...item,
            _original_createdAt: new Date(item.createdAt)
          }));
        })
      )
    ]).pipe(
      tap(() => {
        this.loading$.next(true);
        this.errorMessage$.next('');
      }),
      map(([pagination, sortFields, filterValues, allDataWithOriginalDate]) => {

        let processedData = [...allDataWithOriginalDate];

        // --- 1. Áp dụng LỌC ---
        const activeFilters = Object.entries(filterValues).filter(([key, value]) => value); // Lấy các bộ lọc có giá trị

        if (activeFilters.length > 0) {
          processedData = processedData.filter(item => {
            return activeFilters.every(([key, filterValue]) => {
              const itemValue = item[key];
              if (itemValue === null || itemValue === undefined) {
                return false; // Không khớp nếu giá trị là null/undefined
              }
              // Chuyển đổi giá trị item và filter thành chuỗi để so sánh không phân biệt chữ hoa/thường
              const itemString = String(itemValue).toLowerCase();
              const filterString = String(filterValue).toLowerCase();
              return itemString.includes(filterString);
            });
          });
        }

        // --- 2. Áp dụng SẮP XẾP (trên dữ liệu đã lọc) ---
        if (sortFields && sortFields.column && sortFields.state) {
          const { column: key, state: direction } = sortFields;
          processedData.sort((a: any, b: any) => {
            let valA: any;
            let valB: any;
            if (key === 'createdAt') {
              const dateA = a._original_createdAt;
              const dateB = b._original_createdAt;
              valA = dateA instanceof Date && !isNaN(dateA.getTime()) ? dateA.getTime() : (direction === 'asc' ? Infinity : -Infinity);
              valB = dateB instanceof Date && !isNaN(dateB.getTime()) ? dateB.getTime() : (direction === 'asc' ? Infinity : -Infinity);
            } else {
              valA = a[key];
              valB = b[key];
              valA = valA ?? (direction === 'asc' ? Infinity : -Infinity);
              valB = valB ?? (direction === 'asc' ? Infinity : -Infinity);
            }
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
          });
        }

        // --- 3. Tính toán tổng số trang (dựa trên dữ liệu đã lọc) ---
        const totalItemsAfterFilter = processedData.length;
        const totalPages = Math.ceil(totalItemsAfterFilter / pagination.size);
        this.totalPages$.next(totalPages);

        // --- 4. Định dạng ngày tháng (trên dữ liệu đã lọc và sắp xếp) ---
        const formattedData = processedData.map((item: any) => ({
          ...item,
          createdAt: item._original_createdAt instanceof Date && !isNaN(item._original_createdAt.getTime())
                     ? item._original_createdAt.toLocaleString('vi-VN', { hour12: false })
                     : 'Invalid Date'
        }));

        // --- 5. Áp dụng PHÂN TRANG (trên dữ liệu đã lọc, sắp xếp, định dạng) ---
        const startIndex = (pagination.page - 1) * pagination.size;
        const endIndex = startIndex + pagination.size;
        const paginatedData = formattedData.slice(startIndex, endIndex);

        this.loading$.next(false);
        this.cdr.markForCheck();

        return paginatedData;
      }),
      startWith([]),
      takeUntil(this.#destroy$)
    );
    this.spinner.hide(); // Hide spinner when data stream setup is complete
  }

  ngOnInit(): void {
    console.log('FacultyComponent initialized.');
  }

  ngOnDestroy(): void {
    this.#destroy$.next(true);
    this.#destroy$.complete();
  }

  // --- Event Handlers ---
  handleActivePageChange(page: number): void {
    // Reset về trang 1 nếu đang lọc? Có thể cần thiết tùy logic UX
    const currentPagination = this.pagination$.value;
    this.pagination$.next({ ...currentPagination, page: page });
  }

  handleItemsPerPageChange(size: number): void {
    // Reset về trang 1 khi thay đổi kích thước trang
    this.pagination$.next({ page: 1, size });
  }

  handleSorterValueChange(sorterValue: ISorterValue): void {
     // Reset về trang 1 khi thay đổi sắp xếp
    this.pagination$.next({ ...this.pagination$.value, page: 1 });
    this.sortFields$.next(sorterValue);
  }

  // --- Thêm Handler cho Bộ lọc ---
  handleFilterChange(filterValue: IColumnFilterValue): void {
    const currentFilters = this.filterValues$.value;
    const updatedFilters = {
      ...currentFilters,
      [filterValue['column']]: filterValue['value'] // Cập nhật giá trị lọc cho cột tương ứng
    };
    // Reset về trang 1 khi thay đổi bộ lọc
    this.pagination$.next({ ...this.pagination$.value, page: 1 });
    this.filterValues$.next(updatedFilters);
  }

  // --- Utility Methods ---
  private formatSortParam(sorter: ISorterValue): string {
    if (!sorter || !sorter.column || !sorter.state) {
      // Đảm bảo key khớp với logic sắp xếp (createdAt)
      return 'createdAt,asc'; // Hoặc 'desc' tùy theo mặc định bạn muốn
    }
    return `${sorter.column},${sorter.state}`;
  }

  goToCreateFaculty() {
    this.router.navigate([ROUTES.RECEPTIONIST.children.FACULTY.children.CREATE.fullPath]);
  }

  goToDetailFaculty(id: string) {
    this.router.navigate([ROUTES.RECEPTIONIST.children.FACULTY.children.DETAIL.fullPath(id)]);
  }

  goToEditFaculty(id: string) {
    this.router.navigate([ROUTES.RECEPTIONIST.children.FACULTY.children.EDIT.fullPath(id)]);
  }

  toggleAbleFaculty(id: number) {
    this.facultyService.toggleAbleFaculty(id).subscribe({
      next: (response) => {
        this.snackbar.notifySuccess(response.message);
        this.data$ = this.data$.pipe(
          map((facultys) => {
            return facultys.map((faculty) => {
              if (faculty.id === id) {
                faculty.able = faculty.able;
              }
              return faculty;
            });
          })
        );
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.snackbar.notifyError(error.error.message);
      }
    });
  }
}