import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, tap, takeUntil, startWith, distinctUntilChanged } from 'rxjs/operators';
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
  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly errorMessage$ = new Subject<string>();
  readonly #destroy$ = new Subject<boolean>();

  // --- Data Streams ---
  readonly apiParams$: Observable<any>;
  readonly props$: Observable<any>;
  data$: Observable<FacultyResponse[]>;

  roleId = 2; // ID của vai trò "Lễ tân"

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
      this.facultyService.getAllFaculty().pipe(
        // Tạo trường Date gốc trước
        map(response => {
          const data = Array.isArray(response?.result) ? response.result : [];
          return data.map((item: any) => ({
            ...item,
            _original_createdAt: new Date(item.createdAt) // Tạo đối tượng Date gốc
          }));
        })
      )
    ]).pipe(
      tap(() => {
        this.loading$.next(true);
        this.errorMessage$.next('');
      }),
      map(([params, allDataWithOriginalDate]) => { // allData giờ có _original_createdAt

        // Bỏ data.reverse()
        let processedData = [...allDataWithOriginalDate];

        // Áp dụng sắp xếp TRƯỚC KHI ĐỊNH DẠNG
        if (params.sort) {
          const [key, direction] = params.sort.split(',');

          processedData.sort((a: any, b: any) => {
            let valA: any;
            let valB: any;

            // --- Xử lý sắp xếp cho cột ngày tháng ---
            if (key === 'createdAt') {
              const dateA = a._original_createdAt;
              const dateB = b._original_createdAt;
              // Xử lý Invalid Date nếu cần (tương tự component trước)
              valA = dateA instanceof Date && !isNaN(dateA.getTime()) ? dateA.getTime() : (direction === 'asc' ? Infinity : -Infinity);
              valB = dateB instanceof Date && !isNaN(dateB.getTime()) ? dateB.getTime() : (direction === 'asc' ? Infinity : -Infinity);
            } else {
              // Sắp xếp các cột khác
              valA = a[key];
              valB = b[key];
              // Xử lý null/undefined nếu cần
              valA = valA ?? (direction === 'asc' ? Infinity : -Infinity);
              valB = valB ?? (direction === 'asc' ? Infinity : -Infinity);
            }

            // Thực hiện so sánh
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
          });
        }

        // Định dạng ngày tháng SAU KHI sắp xếp
        const formattedData = processedData.map((item: any) => ({
          ...item,
          // Định dạng từ đối tượng Date gốc
          createdAt: item._original_createdAt instanceof Date && !isNaN(item._original_createdAt.getTime())
                     ? item._original_createdAt.toLocaleString('vi-VN', { hour12: false })
                     : 'Invalid Date' // Hoặc dùng DatePipe nếu muốn
        }));

        // Áp dụng phân trang trên dữ liệu đã sắp xếp và định dạng
        const startIndex = (params.page - 1) * params.size;
        const endIndex = startIndex + params.size;
        // Phân trang trên formattedData (đã đúng thứ tự)
        const paginatedData = formattedData.slice(startIndex, endIndex);

        // Cập nhật tổng số trang dựa trên tổng số dữ liệu TRƯỚC khi phân trang
        const totalPages = Math.ceil(formattedData.length / params.size);
        this.totalPages$.next(totalPages);

        this.loading$.next(false);
        this.cdr.markForCheck(); // Đảm bảo view cập nhật

        return paginatedData; // Trả về dữ liệu đã phân trang
      }),
      startWith([]), // Bắt đầu với mảng rỗng
      takeUntil(this.#destroy$) // Hủy subscription khi component bị destroy
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