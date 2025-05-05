import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { firstValueFrom, Subscription } from 'rxjs';

import { EventDialogComponent, EventDialogResult } from './event-dialog/event-dialog.component';
import { INITIAL_EVENTS } from './event-utils';

import { CommonModule } from '@angular/common';
import { ButtonDirective, CardModule } from '@coreui/angular';
import { Calendar } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AuthService } from '../../../../../core/services/auth.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { UserService } from '../../../../../core/services/user.service';
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
    ButtonDirective
  ],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;


  userID: number = -1; // Mã nhân sự được nhập

  validated: boolean = false;
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
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    datesSet: this.handleDatesSet.bind(this),
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
    private authService: AuthService,
    private spinner: NgxSpinnerService,
  ) {// Ensure no invalid license key message is displayed
    this.userID = this.authService.getUserId() || -1; // Lấy mã nhân sự từ authService

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
          userId: (this.userID)
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
      }
    }, 0);

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
    const startTime = this.removeUTCOffset(dateInfo.startStr); // Ngày bắt đầu của chế độ xem
    const endTime = this.removeUTCOffset(dateInfo.endStr); // Ngày kết thúc của chế độ xem

    const eventReq: EventRequest = {
      startTime: startTime,
      endTime: endTime,
      userId: (this.userID)
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

  handleEventClick(clickInfo: EventClickArg): void {
    this.removeLicenseKeyMessage();
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: {
        mode: 'view',
        eventData: {
          id: clickInfo.event.id,
          start: clickInfo.event.startStr,
          end: clickInfo.event.endStr,
        },
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

  formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

      pdf.save(`lich_lam_viec_${this.userID}.pdf`); // Use bill ID in filename
      this.spinner.hide(); // Hide spinner after saving
      this.snackBar.notifySuccess('Đã tạo file PDF thành công.');

    }).catch(error => {
        console.error("Error generating PDF: ", error);
        this.spinner.hide(); // Hide spinner on error
        this.snackBar.notifyError('Lỗi khi tạo file PDF.');
    });
  }
}