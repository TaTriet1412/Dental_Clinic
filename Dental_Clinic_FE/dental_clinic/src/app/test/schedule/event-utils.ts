import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // Lấy ngày YYYY-MM-DD hôm nay

export function createEventId() {
  // Trong ứng dụng thực tế, ID nên được tạo bởi backend
  return String(eventGuid++);
}

// Dữ liệu nhân viên mẫu
export const SAMPLE_RESOURCES = [
    { id: '1', title: 'Nguyễn Văn A', extendedProps: { department: 'Tech' } },
    { id: '2', title: 'Trần Thị B', extendedProps: { department: 'Sales' } },
    { id: '3', title: 'Lê Văn C', extendedProps: { department: 'Tech' } },
    { id: '4', title: 'Phạm Thị D', extendedProps: { department: 'HR' } }
];

// Dữ liệu lịch làm việc mẫu
export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    resourceId: 'nv001', // Gán cho NV A
    title: 'Họp team dự án X',
    start: TODAY_STR + 'T09:00:00',
    end: TODAY_STR + 'T10:30:00',
    // extendedProps: { status: 'confirmed' }, // Dữ liệu tùy chỉnh
    // backgroundColor: 'blue', // Màu nền tùy chỉnh
    // borderColor: 'darkblue' // Màu viền tùy chỉnh
  },
  {
    id: createEventId(),
    resourceId: '1', // Gán cho NV B
    title: 'Làm việc tại VP',
    start: TODAY_STR + 'T08:00:00',
    end: TODAY_STR + 'T17:00:00'
  },
  {
    id: createEventId(),
    resourceId: '2', // Gán cho NV A
    title: 'Gặp khách hàng ABC',
    start: TODAY_STR + 'T14:00:00',
    end: TODAY_STR + 'T15:00:00'
  },
   {
    id: createEventId(),
    resourceId: '3', // Gán cho NV C
    title: 'Nghỉ phép',
    start: TODAY_STR +  'T08:00:00', // Chỉ cần ngày nếu allDay=true
    end: TODAY_STR + 'T17:00:00',
  },
  {
    id: createEventId(),
    resourceId:  '3',
    title: 'Training nội bộ',
    start: TODAY_STR + 'T16:00:00',
    end: TODAY_STR + 'T17:30:00'
  }
];