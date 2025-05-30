import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy, resource, Input } from '@angular/core';
import { CalendarOptions, EventClickArg, DateSelectArg, EventApi } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Subscription } from 'rxjs';

import { EventDialogComponent, EventDialogResult } from './event-dialog/event-dialog.component';
import { INITIAL_EVENTS, createEventId } from './event-utils';

import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { Calendar } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import { CommonModule } from '@angular/common';
import { ButtonDirective, CardModule, ColComponent, FormControlDirective, FormDirective, FormFeedbackComponent, FormSelectDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { RowComponent } from '@coreui/angular-pro';
import { FormsModule } from '@angular/forms';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { UserService } from '../../../../../core/services/user.service';
import { NameIdUserResponse } from '../../../../../share/dto/response/name-id-user-response';
import { WorkSchdeduleService } from '../../../../../core/services/work-schedule.service';
import { EventRequest } from '../../../../../share/dto/request/event-request';
import { jsPDF } from 'jspdf'; // Correct import for jsPDF class
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';


export interface LocalEventDialogResult {
  title: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-work-schedule',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    FormFeedbackComponent,
    FormsModule,
    FormDirective,
    FormSelectDirective,
    ButtonDirective,
    FormControlDirective
  ],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  roleList = [
    { id: 2, name: 'RECEPTIONIST', displayName: 'Lễ tân' },
    { id: 3, name: 'DENTIST', displayName: 'Nha sĩ' },
    { id: 4, name: 'ASSISTANT', displayName: 'Phụ tá' },
  ];

  employeeList: NameIdUserResponse[] = [];
  enteredCode: string = ''; // Mã nhân sự được nhập

  selectedRole: string = '';
  selectedEmployee: string = '';
  validated: boolean = false;
  calendarVisible: boolean = false; // Lịch làm việc ẩn mặc định

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, resourceTimelinePlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: viLocale, // Đặt ngôn ngữ là tiếng Việt
    events: INITIAL_EVENTS,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    datesSet: this.handleDatesSet.bind(this),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventTimeFormat: { // Định dạng này sẽ hiển thị HH:mm - HH:mm (ví dụ: 08:00 - 17:00)
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false, // Sử dụng định dạng 24 giờ
      hour12: false    // Đảm bảo là 24 giờ
    },
    displayEventEnd: true // Đảm bảo rằng thời gian kết thúc được hiển thị (thường là mặc định)
  };

  currentEvents: EventApi[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private workScheduleService: WorkSchdeduleService,
    private spinner: NgxSpinnerService,
  ) {// Ensure no invalid license key message is displayed
    Calendar.prototype.render = function () {
      const originalRender = Calendar.prototype.render;
      return function (this: Calendar) {
        originalRender.apply(this, arguments as any);
        const licenseKeyMessage = document.querySelector('.fc-license-message');
        if (licenseKeyMessage) {
          licenseKeyMessage.remove();
        }
      };
    }();
  }

  async handleDatesSet(dateInfo: any): Promise<void> {
    // console.log('Current View:', dateInfo.view.type); // Loại chế độ xem (dayGridMonth, timeGridWeek, timeGridDay)
    // console.log('Start Date:', dateInfo.startStr); // Ngày bắt đầu của phạm vi hiển thị
    // console.log('End Date:', dateInfo.endStr); // Ngày kết thúc của phạm vi hiển thị
    // console.log('Current Date:', dateInfo.start); // Ngày hiện tại trong chế độ xem

    const startTime = this.removeUTCOffset(dateInfo.startStr); // Ngày bắt đầu của chế độ xem
    const endTime = this.removeUTCOffset(dateInfo.endStr); // Ngày kết thúc của chế độ xem

    const eventReq: EventRequest = {
      startTime: startTime,
      endTime: endTime,
      userId: Number.parseInt(this.enteredCode)
    };

    try {
      // Sử dụng firstValueFrom để chuyển Observable thành Promise
      const response: any = await firstValueFrom(this.workScheduleService.getEventsByRangeTime(eventReq));
      this.calendarOptions.events = response.result.map((event: any) => ({
        id: event.id,
        start: event.startTime,
        end: event.endTime,
      }));
    } catch (error: any) {
      this.snackBar.notifyError(error.error.message);
    }
  }


  removeUTCOffset(IOS: string): string {
    // Chuyển đổi định dạng ngày tháng từ YYYY-MM-DDTHH:mm:ss thành YYYY-MM-DD
    return IOS.split('+')[0];
  }



  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    this.removeLicenseKeyMessage();
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
        mode: 'add',
        eventData: {
          start: selectInfo.startStr,
          end: selectInfo.endStr
        },
      }
    });

    const startTime = this.removeUTCOffset(selectInfo.startStr); // Ngày bắt đầu của chế độ xem
    const endTime = this.removeUTCOffset(selectInfo.endStr); // Ngày kết thúc của chế độ xem

    const eventReq: EventRequest = {
      startTime: startTime,
      endTime: endTime,
      userId: Number.parseInt(this.enteredCode)
    };

    dialogRef.afterClosed().subscribe((result: EventDialogResult) => {
      if (result?.action === 'save' && result.event) {
        const eventReq: EventRequest = {
          startTime: this.removeUTCOffset(result.event.start),
          endTime: this.removeUTCOffset(result.event.end),
          userId: Number.parseInt(this.enteredCode)
        };

        this.workScheduleService.createEvent(eventReq).subscribe({
          next: () => {
            const calendarApi = selectInfo.view.calendar;
            calendarApi.unselect(); // Clear selection
            calendarApi.addEvent({
              id: result.event!.id || String(new Date().getTime()), // Generate ID if not provided
              start: result.event!.start,
              end: result.event!.end,
            });
            this.snackBar.notifySuccess('Thêm lịch làm việc thành công!');
          },
          error: (error) => {
            this.snackBar.notifyError(error.error.message);
          }
        });
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    this.removeLicenseKeyMessage();
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        eventData: {
          id: clickInfo.event.id,
          start: clickInfo.event.startStr,
          end: clickInfo.event.endStr,
        },
      }
    });

    const startTime = this.removeUTCOffset(clickInfo.event.startStr); // Ngày bắt đầu của chế độ xem
    const endTime = this.removeUTCOffset(clickInfo.event.endStr); // Ngày kết thúc của chế độ xem

    const eventReq: any = {
      startTime: startTime,
      endTime: endTime,
      id: clickInfo.event.id
    };

    dialogRef.afterClosed().subscribe((result: EventDialogResult) => {
      this.removeLicenseKeyMessage();

      if (result) {
        if (result.action === 'save' && result.event) {
          eventReq.startTime = this.removeUTCOffset(result.event!.start);
          eventReq.endTime = this.removeUTCOffset(result.event!.end);

          this.workScheduleService.updateEvent(eventReq).subscribe({
            next: () => {
              clickInfo.event.setDates(result.event!.start, result.event!.end);
              this.snackBar.notifySuccess('Thay đổi làm việc thành công!');
            },
            error: (error) => {
              this.snackBar.notifyError(error.error.message);
            }
          });
        } else if (result.action === 'delete') {
          // Delete the event
          this.workScheduleService.deleteEvent((clickInfo.event.id)).subscribe({
            next: () => {
              clickInfo.event.remove();
              this.snackBar.notifySuccess('Xoá lịch thành công!');
            },
            error: (error) => {
              this.snackBar.notifyError(error.error.message);
            },
          });
        }
      }
    });
  }

  handleEvents(events: EventApi[]): void {
    this.currentEvents = events;
    this.cdr.detectChanges();

    this.removeLicenseKeyMessage();
  }


  removeLicenseKeyMessage(): void {
    const licenseKeyMessage = document.querySelector('.fc-license-message');
    if (licenseKeyMessage) {
      licenseKeyMessage.remove();
    }
  }

  onRoleChange(event: Event): void {
    const selectedRole = (event.target as HTMLSelectElement).value;
    this.userService.getNameIdUserListByRoleId(Number(selectedRole))
      .subscribe(
        {
          next: (response: any) => {
            this.employeeList = response.result as NameIdUserResponse[];
          },
          error: (error) => {
            console.error('Error fetching employee list:', error);
            this.snackBar.notifyError('Lỗi khi tải danh sách nhân viên!');
          }
        }
      )
    this.selectedRole = selectedRole; // Cập nhật kiểu nhân sự
    this.enteredCode = ''; // Reset mã nhân sự
    this.selectedEmployee = ''; // Reset tên nhân sự
    this.calendarVisible = false; // Ẩn lịch làm việc khi thay đổi nhân sự
  }

  onEmployeeSubmit(form: any): void {
    this.validated = true;

    if (form.valid && this.enteredCode && this.selectedEmployee && this.selectedRole) {
      if (!this.calendarVisible) {
        this.calendarVisible = true;
      }

      // 2. Sử dụng setTimeout để đảm bảo calendarComponent đã sẵn sàng
      setTimeout(() => {
        // *** Kiểm tra lại calendarComponent bên trong setTimeout ***
        if (this.calendarComponent) {
          const calendarApi = this.calendarComponent.getApi(); // Bây giờ calendarApi chắc chắn có
          const currentView = calendarApi.view;

          const gridStartDate = currentView.activeStart; // Thứ 2 đầu lưới
          const gridEndDateExclusive = currentView.activeEnd; // Sau Chủ Nhật cuối lưới
          const gridEndDateInclusive = new Date(gridEndDateExclusive.getTime() - 1); // Chủ Nhật cuối lưới

          // Gọi handleDatesSet để tải dữ liệu cho view hiện tại
          // Truyền đối tượng dateInfo giả lập nếu cần, hoặc để handleDatesSet tự lấy view


          // Gọi API để lấy lịch làm việc của nhân sự mới
          const startTime = this.formatDateForAPI(gridStartDate); // Định dạng YYYY-MM-DD
          const endTime = this.formatDateForAPI(gridEndDateInclusive);  // Ngày kết thúc (1 tháng sau)

          this.snackBar.notifySuccess('Đang tải lịch làm việc...');

          const eventReq: EventRequest = {
            startTime: startTime + "T00:00:00", // Thêm giờ nếu cần
            endTime: endTime + "T23:59:59", // Thêm giờ nếu cần
            userId: Number.parseInt(this.enteredCode)
          };

          this.workScheduleService.getEventsByRangeTime(eventReq).subscribe({
            next: (response: any) => {
              // Cập nhật sự kiện trong calendarOptions
              calendarApi.removeAllEvents(); // Xóa sự kiện cũ
              const newEvents = response.result.map((event: any) => ({
                id: event.id,
                start: event.startTime,
                end: event.endTime,
                // Thêm các thuộc tính khác nếu cần (title, color, etc.)
              }));
              calendarApi.addEventSource(newEvents);

              this.snackBar.notifySuccess('Tìm kiếm thành công!');
            },
            error: (error) => {
              this.snackBar.notifyError(error.error.message);
            }
          });
        } else {
          // Trường hợp cực kỳ hiếm: calendar vẫn chưa sẵn sàng sau setTimeout(0)
          console.error('Lỗi: Calendar component không sẵn sàng sau khi đợi!');
          this.snackBar.notifyError('Lỗi hiển thị lịch, vui lòng thử lại.');
          this.calendarVisible = false; // Ẩn lại nếu lỗi
        }
      }, 0);



    } else {
      this.calendarVisible = false; // Ẩn lịch làm việc nếu không hợp lệ
      this.snackBar.notifyError('Vui lòng chọn đầy đủ thông tin!');
    }
  }

  formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onEmployeeChange(event: Event): void {
    const selectedName = (event.target as HTMLSelectElement).value;
    this.selectedEmployee = selectedName; // Cập nhật tên nhân sự
    const matchedEmployee = this.employeeList.find(employee => employee.name === selectedName);

    if (matchedEmployee) {
      this.enteredCode = (matchedEmployee.id).toString(); // Đồng bộ mã nhân sự
    } else {
      this.enteredCode = ''; // Reset mã nhân sự nếu không khớp
    }
    this.calendarVisible = false; // Ẩn lịch làm việc khi thay đổi nhân sự
  }

  onCodeInput(event: Event): void {
    const inputCode = (event.target as HTMLInputElement).value;
    this.enteredCode = inputCode; // Cập nhật mã nhân sự
    const matchedEmployee = this.employeeList.find(employee => employee.id.toString() === inputCode);

    if (matchedEmployee) {
      this.selectedEmployee = matchedEmployee.name; // Đồng bộ tên nhân sự
    } else {
      this.selectedEmployee = ''; // Reset tên nhân sự nếu không khớp
    }
    this.calendarVisible = false; // Ẩn lịch làm việc khi thay đổi nhân sự
  }

  printPDF(): void {
    if (!this.calendarComponent) {
       this.snackBar.notifyError('Chưa tải đủ thông tin lịch làm việc để in.');
       return;
    }

    // Use the correct ID from your HTML structure
    const data = document.getElementById('DetailsContainer');
    this.spinner.show(); // Show spinner

    if (!data) {
      console.error("Element with ID 'DetailsContainer' not found!");
      this.snackBar.notifyError('Không tìm thấy nội dung để in.');
      this.spinner.hide(); // Hide spinner after saving
      return;
    }

    const options = {
      scale: 2,
      useCORS: true
    };

    html2canvas(data, options).then(canvas => {
      const imgWidth = 208; // A4 width in mm (leaving some margin)
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF (portrait)
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`lich_lam_viec_${this.enteredCode}.pdf`); // Use bill ID in filename
      this.spinner.hide(); // Hide spinner after saving
      this.snackBar.notifySuccess('Đã tạo file PDF thành công.');

    }).catch(error => {
        console.error("Error generating PDF: ", error);
        this.spinner.hide(); // Hide spinner on error
        this.snackBar.notifyError('Lỗi khi tạo file PDF.');
    });
  }
}