import { INavData } from "@coreui/angular";
import { ROUTES } from "../../../core/constants/routes.constant";

const BASE_PATH = '/dentist';

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
    name: 'Quản lý lịch trình'
  },
  {
    name: 'Kế hoạch thời gian',
    url: ROUTES.RECEPTIONIST.children.SCHEDULE.fullPath,
    iconComponent: { name: 'cib-clockify' },
    children: [
      {
        name: 'Lịch làm việc',
        url: ROUTES.RECEPTIONIST.children.SCHEDULE.children.WORK.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Lịch hẹn',
        url: ROUTES.RECEPTIONIST.children.SCHEDULE.children.APPOINTMENT.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Quản lý hồ sơ bệnh nhân'
  },
  {
    name: 'Bệnh nhân',
    url: ROUTES.RECEPTIONIST.children.PATIENT.children.LIST.fullPath,
    iconComponent: { name: 'cil-address-book' },
  },
  {
    title: true,
    name: 'Quản lý hóa đơn'
  },
  {
    name: 'Hóa đơn',
    url: ROUTES.RECEPTIONIST.children.PAYMENT.children.LIST.fullPath,
    iconComponent: { name: 'cil-money' },
  },
  {
    title: true,
    name: 'Quản lý nhân sự'
  },
  {
    name: 'Nhân viên',
    url: ROUTES.RECEPTIONIST.children.EMPLOYEE.fullPath,
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Nha sĩ',
        url: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.DENTIST.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phụ tá',
        url: ROUTES.RECEPTIONIST.children.EMPLOYEE.children.ASSISTANT.fullPath,
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
    url: ROUTES.RECEPTIONIST.children.FACULTY.children.LIST.fullPath,
    iconComponent: { name: 'cil-building' },
  },
  {
    title: true,
    name: 'Mục toa thuốc'
  },
  {
    name: 'Toa thuốc',
    url: ROUTES.RECEPTIONIST.children.PRESCRIPTION.children.LIST.fullPath,
    iconComponent: { name: 'cil-note-add' },
  },
  {
    title: true,
    name: 'Mục dịch vụ'
  },
  {
    name: 'Dịch vụ *',
    url: ROUTES.RECEPTIONIST.children.SERVICE.fullPath,
    iconComponent: { name: 'cil-sofa' },
    children: [
      {
        name: 'Dịch vụ',
        url: ROUTES.RECEPTIONIST.children.SERVICE.children.DENTAL.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phân loại',
        url: ROUTES.RECEPTIONIST.children.SERVICE.children.CATEGORY.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Mục vật liệu'
  },
  {
    name: 'Vật liệu *',
    url: ROUTES.RECEPTIONIST.children.MATERIAL.fullPath,
    iconComponent: { name: 'cil-medical-cross' },
    children: [
      {
        name: 'Vật liệu cố định',
        url: ROUTES.RECEPTIONIST.children.MATERIAL.children.FIXED.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vật liệu tiêu hao',
        url: ROUTES.RECEPTIONIST.children.MATERIAL.children.CONSUMABLE.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Thành phần',
        url: ROUTES.RECEPTIONIST.children.MATERIAL.children.INGREDIENT.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phân loại',
        url: ROUTES.RECEPTIONIST.children.MATERIAL.children.CATEGORY.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
]
