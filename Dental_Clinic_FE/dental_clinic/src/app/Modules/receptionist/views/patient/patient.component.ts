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
import { PatientService } from '../../../../core/services/patient.service';
import { PatientResponse } from '../../../../share/dto/response/patient-response';

@Component({
  selector: 'app-patient',
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
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientComponent implements OnInit, OnDestroy {

  private snackbar = inject(SnackBarService);
  private cdr = inject(ChangeDetectorRef);

  // --- State Management ---
  readonly pagination$ = new BehaviorSubject<{ page: number; size: number }>({ page: 1, size: 5 });
  readonly sortFields$ = new BehaviorSubject<ISorterValue>({ column: 'patientDate', state: 'asc' });
  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1);
  readonly errorMessage$ = new Subject<string>();
  readonly #destroy$ = new Subject<boolean>();

  // --- Data Streams ---
  readonly apiParams$: Observable<any>;
  readonly props$: Observable<any>;
  data$: Observable<PatientResponse[]>;

  roleId = 2; // ID của vai trò "Lễ tân"

  // --- Table Columns ---
  readonly columns: (IColumn | string)[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên bệnh nhân' },
    { key: 'address', label: 'Địa chỉ' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'SĐT' },
    { key: 'birthday', label: 'Ngày sinh' },
    { key: 'created_at', label: 'TG tạo' },
    { key: 'gender', label: 'Giới tính' },
    { key: 'interact', label: 'Thao tác', sorter: false, filter: false },
  ];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private patientService: PatientService,
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
    this.data$ = combineLatest([this.apiParams$, this.patientService.getAllPatient()]).pipe(
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
          created_at: new Date(item.created_at).toLocaleString('vi-VN'),
          birthday: new Date(item.birthday).toLocaleDateString('vi-VN'),
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
    console.log('PatientComponent initialized.');
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
      return 'patientDate,asc'; // Default sort
    }
    return `${sorter.column},${sorter.state}`;
  }

  goToCreatePatient() {
    this.router.navigate([ROUTES.RECEPTIONIST.children.PATIENT.children.CREATE.fullPath]);
  }

  goToDetailPatient(id: string) {
    this.router.navigate([ROUTES.RECEPTIONIST.children.PATIENT.children.DETAIL.fullPath(id)]);
  }

  goToEditPatient(id: string) {
    this.router.navigate([ROUTES.RECEPTIONIST.children.PATIENT.children.EDIT.fullPath(id)]);
  }
}