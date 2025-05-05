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
  },
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
    name: 'Quản lý dịch vụ'
  },
  {
    name: 'Dịch vụ *',
    url: ROUTES.ADMIN.children.SERVICE.fullPath,
    iconComponent: { name: 'cil-sofa' },
    children: [
      {
        name: 'Dịch vụ',
        url: ROUTES.ADMIN.children.SERVICE.children.DENTAL.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phân loại',
        url: ROUTES.ADMIN.children.SERVICE.children.CATEGORY.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Quản lý vật liệu'
  },
  {
    name: 'Vật liệu *',
    url: ROUTES.ADMIN.children.MATERIAL.fullPath,
    iconComponent: { name: 'cil-medical-cross' },
    children: [
      {
        name: 'Vật liệu cố định',
        url: ROUTES.ADMIN.children.MATERIAL.children.FIXED.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vật liệu tiêu hao',
        url: ROUTES.ADMIN.children.MATERIAL.children.CONSUMABLE.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Thành phần',
        url: ROUTES.ADMIN.children.MATERIAL.children.INGREDIENT.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phân loại',
        url: ROUTES.ADMIN.children.MATERIAL.children.CATEGORY.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Quản lý toa thuốc'
  },
  {
    name: 'Toa thuốc',
    url: ROUTES.ADMIN.children.PRESCRIPTION.children.LIST.fullPath,
    iconComponent: { name: 'cil-note-add' },
  },
  {
    title: true,
    name: 'Quản lý hóa đơn'
  },
  {
    name: 'Hóa đơn',
    url: ROUTES.ADMIN.children.PAYMENT.children.LIST.fullPath,
    iconComponent: { name: 'cil-money' },
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
  
]
