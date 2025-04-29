import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy, resource } from '@angular/core';
import { CalendarOptions, EventClickArg, DateSelectArg, EventApi } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { INITIAL_EVENTS, SAMPLE_RESOURCES, createEventId } from './event-utils';

import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { Calendar } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import { EventDialogComponent, EventDialogResult } from '../event-dialog/event-dialog.component';



export interface LocalEventDialogResult {
  title: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;
  calendarVisible: boolean = true;
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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  currentEvents: EventApi[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
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
          title: '',
          start: selectInfo.startStr,
          end: selectInfo.endStr
        },
        resources: SAMPLE_RESOURCES
      }
    });

    dialogRef.afterClosed().subscribe((result: EventDialogResult) => {
      this.removeLicenseKeyMessage();

      if (result?.action === 'save' && result.event) {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect(); // Clear selection


        calendarApi.addEvent({
          id: result.event.id || String(new Date().getTime()), // Generate ID if not provided
          title: result.event.title,
          start: result.event.start,
          end: result.event.end,
          resourceId: result.event.resourceId
        });

        this.snackBar.open('Event added successfully!', 'Close', { duration: 3000 });
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
          title: clickInfo.event.title,
          start: clickInfo.event.startStr,
          end: clickInfo.event.endStr,
          resourceId: clickInfo.event._def.resourceIds?.[0] ?? null
        },
        resources: SAMPLE_RESOURCES
      }
    });

    dialogRef.afterClosed().subscribe((result: EventDialogResult) => {
      this.removeLicenseKeyMessage();
      if (result) {
        if (result.action === 'save' && result.event) {
          // Update the event
          clickInfo.event.setProp('title', result.event.title);
          clickInfo.event.setDates(result.event.start, result.event.end);
          const tempresourceId = result.event.resourceId;
          if (tempresourceId) {
            clickInfo.event._def.resourceIds = [tempresourceId];
          }

          this.snackBar.open('Event updated successfully!', 'Close', { duration: 3000 });
        } else if (result.action === 'delete') {
          // Delete the event
          clickInfo.event.remove();
          this.snackBar.open('Event deleted successfully!', 'Close', { duration: 3000 });
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
}