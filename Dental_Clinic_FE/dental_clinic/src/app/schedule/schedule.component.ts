import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
// Import các types và API cốt lõi từ @fullcalendar/core
// CHÚ Ý: TypeScript sẽ cố gắng hợp nhất các định nghĩa dưới đây vào các kiểu này
import { CalendarOptions, EventClickArg, DateSelectArg, EventApi, ViewApi } from '@fullcalendar/core';
// Import Angular component wrapper từ @fullcalendar/angular
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { EventDialogComponent, EventDialogResult } from '../event-dialog/event-dialog.component';
import { INITIAL_EVENTS, SAMPLE_RESOURCES, createEventId } from './event-utils';

// *** IMPORT CÁC PLUGIN CẦN THIẾT ***
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

//-------------------------------------------------------------------//
// *** ĐỊNH NGHĨA TYPE AUGMENTATION TRỰC TIẾP TẠI ĐÂY ***            //
// Lưu ý: Cách này không chuẩn và có thể không ổn định bằng file .d.ts //
//-------------------------------------------------------------------//
declare module '@fullcalendar/core' {

    // --- Định nghĩa kiểu Resource cơ bản ---
    // (Cần thiết nếu interface mở rộng khác tham chiếu đến nó)
    interface ResourceApi {
        id: string;
        title: string;
        extendedProps?: Record<string, any>;
        [key: string]: any;
    }

    // --- Mở rộng CalendarOptions ---
    // Chỉ thêm các thuộc tính KHÔNG CÓ trong bản gốc
    interface CalendarOptions {
        schedulerLicenseKey?: string;
        resources?: ResourceApi[] | string | Function; // Dùng Function cho đơn giản
        resourceAreaHeaderContent?: string | { html: string };
        resourceAreaWidth?: string | number;
        resourceLabelDidMount?: (arg: { resource: ResourceApi, el: HTMLElement, view: ViewApi }) => void;
        // *** KHÔNG liệt kê lại 'plugins', 'initialView', etc. ở đây ***
    }

    // --- Mở rộng DateSelectArg ---
    interface DateSelectArg {
        resource?: ResourceApi;
    }

    // --- Mở rộng EventApi ---
    interface EventApi {
        getResources(): ResourceApi[];
        setResources(resources: string[] | ResourceApi[]): void;
    }

    // --- (Tùy chọn) Mở rộng ViewApi ---
    // interface ViewApi { ... } // Thêm nếu cần

} // Kết thúc declare module
//-------------------------------------------------------------------//
// *** KẾT THÚC PHẦN TYPE AUGMENTATION ***                         //
//-------------------------------------------------------------------//


// Kiểu dữ liệu cho Resource dùng trong component (vẫn nên định nghĩa rõ ràng)
interface AppResource {
  id: string;
  title: string;
  extendedProps?: Record<string, any>;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private dialogSubscription: Subscription | null = null;

  calendarVisible = true;

  calendarResources: AppResource[] = SAMPLE_RESOURCES;

  // --- Cấu hình FullCalendar ---
  // Vẫn sử dụng kiểu CalendarOptions gốc, mong đợi augmentation ở trên hoạt động
  calendarOptions: CalendarOptions = {
    plugins: [ // Thuộc tính này PHẢI được nhận diện nếu augmentation không gây lỗi
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        resourceTimelinePlugin,
    ],
    // Các thuộc tính mở rộng như schedulerLicenseKey và resources cũng phải OK
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    resources: this.calendarResources, // Thuộc tính này phải OK

    // ... Phần còn lại của calendarOptions giữ nguyên như trước ...
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'resourceTimelineDay,resourceTimelineWeek,timeGridWeek,dayGridMonth'
    },
    initialView: 'resourceTimelineWeek',
    initialEvents: INITIAL_EVENTS,
    locale: 'vi',
    buttonText: {
      today: 'Hôm nay', month: 'Tháng', week: 'Tuần', day: 'Ngày',
      resourceTimelineDay: 'Theo ngày', resourceTimelineWeek: 'Theo tuần', timeGridWeek: 'Lịch tuần', dayGridMonth: 'Lịch tháng'
    },
    firstDay: 1,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    nowIndicator: true,
    weekends: true,
    eventResizableFromStart: true,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    contentHeight: 'auto',
    aspectRatio: 1.8,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventChange.bind(this),
    eventsSet: this.handleEventsSet.bind(this),
    resourceAreaHeaderContent: 'Nhân viên',
    resourceAreaWidth: '20%',
  };

  currentEvents: EventApi[] = []; // Sử dụng EventApi gốc, mong đợi augmentation hoạt động

  constructor(
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.dialogSubscription?.unsubscribe();
  }

  // --- Các hàm xử lý callback (handleDateSelect, handleEventClick, handleEventChange, handleEventsSet) ---
  // Giữ nguyên phần logic như phiên bản trước, vì chúng mong đợi các kiểu đã được augment

  handleDateSelect(selectInfo: DateSelectArg): void { // Mong đợi selectInfo.resource tồn tại
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.unselect();
    const resource = selectInfo.resource; // Nên có kiểu ResourceApi | undefined
    // ... logic còn lại ...
    this.openEventDialog('add', { /* ... */ resourceId: resource ? resource.id : null });
  }

  handleEventClick(clickInfo: EventClickArg): void { // Mong đợi clickInfo.event có getResources()
    const clickedEvent = clickInfo.event; // Nên có kiểu EventApi đã augment
    const resources = clickedEvent.getResources(); // Nên hoạt động
    const resourceId = resources.length > 0 ? resources[0].id : null;
    // ... logic còn lại ...
    this.openEventDialog('edit', { ...clickedEvent.toPlainObject(), resourceId: resourceId });
  }

  handleEventChange(changeInfo: { event: EventApi, oldEvent: EventApi }): void { // Mong đợi event có getResources()
    const changedEvent = changeInfo.event; // Nên có kiểu EventApi đã augment
    // ... logic còn lại ...
    const resourceId = changedEvent.getResources()[0]?.id; // Nên hoạt động
    // ... logic API call ...
  }

  handleEventsSet(events: EventApi[]): void { // events là mảng EventApi đã augment
    this.currentEvents = events;
    this.changeDetector.detectChanges();
    console.log(`Events updated. Count: ${this.currentEvents.length}`);
  }


  // --- Hàm mở Dialog (openEventDialog) ---
  // Giữ nguyên logic như phiên bản trước

  openEventDialog(mode: 'add' | 'edit', data: any): void {
    // ... logic mở dialog ...
    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
        if (!result) return;
        const calendarApi = this.calendarComponent.getApi();
        if (result.action === 'save') {
            // ... logic xử lý save ...
            if (mode === 'edit') {
                const existingEvent = calendarApi.getEventById(eventDataFromDialog.id);
                if (existingEvent) {
                    // ... TODO: API call ...
                    // Mong đợi existingEvent có setResources()
                    existingEvent.setResources([eventDataFromDialog.resourceId]); // Nên hoạt động
                    // ...
                }
            }
        } else if (result.action === 'delete') {
            // ... logic xử lý delete ...
        }
    });
 }


  // --- Hàm tiện ích (showSnackbar) ---
  // Giữ nguyên logic như phiên bản trước
  showSnackbar(message: string, isError: boolean = false): void {
      // ... logic snackbar ...
  }
}