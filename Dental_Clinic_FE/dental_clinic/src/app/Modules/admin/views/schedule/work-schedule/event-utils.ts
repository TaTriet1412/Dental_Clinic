import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // Lấy ngày YYYY-MM-DD hôm nay

export function createEventId() {
  // Trong ứng dụng thực tế, ID nên được tạo bởi backend
  return String(eventGuid++);
}


// Dữ liệu lịch làm việc mẫu
export const INITIAL_EVENTS: EventInput[] = [
  // {
  //   id: createEventId(),
  //   start: TODAY_STR + 'T09:00:00',
  //   end: TODAY_STR + 'T10:30:00',
  //   // extendedProps: { status: 'confirmed' }, // Dữ liệu tùy chỉnh
  //   // backgroundColor: 'blue', // Màu nền tùy chỉnh
  //   // borderColor: 'darkblue' // Màu viền tùy chỉnh
  // },
  // {
  //   id: createEventId(),
  //   start: TODAY_STR + 'T08:00:00',
  //   end: TODAY_STR + 'T17:00:00'
  // },
  // {
  //   id: createEventId(),
  //   start: TODAY_STR + 'T14:00:00',
  //   end: TODAY_STR + 'T15:00:00'
  // },
  //  {
  //   id: createEventId(),
  //   start: TODAY_STR +  'T08:00:00', // Chỉ cần ngày nếu allDay=true
  //   end: TODAY_STR + 'T17:00:00',
  // },
  // {
  //   id: createEventId(),
  //   start: TODAY_STR + 'T16:00:00',
  //   end: TODAY_STR + 'T17:30:00'
  // }
];