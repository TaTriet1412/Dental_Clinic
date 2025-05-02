import { INavData } from "@coreui/angular";
import { ROUTES } from "../../../core/constants/routes.constant";

const BASE_PATH = '/admin';

function prefixUrl(url: string): string {
  // Don't prefix external URLs or empty URLs
  if (!url || url.startsWith('http') || url.startsWith(BASE_PATH)) {
    return url;
  }
  return `${BASE_PATH}${url}`;
}

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Quản lý nhân sự'
  },
  {
    name: 'Nhân viên',
    url: ROUTES.ADMIN.children.EMPLOYEE.fullPath,
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Lễ tân',
        url: ROUTES.ADMIN.children.EMPLOYEE.children.RECEPTIONIST.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Nha sĩ',
        url: ROUTES.ADMIN.children.EMPLOYEE.children.DENTIST.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phụ tá',
        url: ROUTES.ADMIN.children.EMPLOYEE.children.ASSISTANT.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Quản lý khoa'
  },
  {
    name: 'Khoa',
    url: ROUTES.ADMIN.children.FACULTY.children.LIST.fullPath,
    iconComponent: { name: 'cil-building' },
  },
  {
    title: true,
    name: 'Quản lý hồ sơ bệnh nhân'
  },
  {
    name: 'Bệnh nhân',
    url: ROUTES.ADMIN.children.PATIENT.children.LIST.fullPath,
    iconComponent: { name: 'cil-address-book' },
  },
  {
    title: true,
    name: 'Quản lý lịch trình'
  },
  {
    name: 'Kế hoạch thời gian',
    url: ROUTES.ADMIN.children.SCHEDULE.fullPath,
    iconComponent: { name: 'cib-clockify' },
    children: [
      {
        name: 'Lịch làm việc',
        url: ROUTES.ADMIN.children.SCHEDULE.children.WORK.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Lịch hẹn',
        url: ROUTES.ADMIN.children.SCHEDULE.children.APPOINTMENT.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  }
]
