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
    name: 'Quản lý toa thuốc'
  },
  {
    name: 'Toa thuốc',
    url: ROUTES.DENTIST.children.PRESCRIPTION.children.LIST.fullPath,
    iconComponent: { name: 'cil-note-add' },
  },
  {
    title: true,
    name: 'Mục lịch trình'
  },
  {
    name: 'Kế hoạch thời gian',
    url: ROUTES.DENTIST.children.SCHEDULE.fullPath,
    iconComponent: { name: 'cib-clockify' },
    children: [
      {
        name: 'Lịch làm việc',
        url: ROUTES.DENTIST.children.SCHEDULE.children.WORK.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Lịch hẹn',
        url: ROUTES.DENTIST.children.SCHEDULE.children.APPOINTMENT.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Mục dịch vụ'
  },
  {
    name: 'Dịch vụ *',
    url: ROUTES.DENTIST.children.SERVICE.fullPath,
    iconComponent: { name: 'cil-sofa' },
    children: [
      {
        name: 'Dịch vụ',
        url: ROUTES.DENTIST.children.SERVICE.children.DENTAL.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phân loại',
        url: ROUTES.DENTIST.children.SERVICE.children.CATEGORY.fullPath,
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
    url: ROUTES.DENTIST.children.MATERIAL.fullPath,
    iconComponent: { name: 'cil-medical-cross' },
    children: [
      {
        name: 'Vật liệu cố định',
        url: ROUTES.DENTIST.children.MATERIAL.children.FIXED.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vật liệu tiêu hao',
        url: ROUTES.DENTIST.children.MATERIAL.children.CONSUMABLE.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Thành phần',
        url: ROUTES.DENTIST.children.MATERIAL.children.INGREDIENT.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Phân loại',
        url: ROUTES.DENTIST.children.MATERIAL.children.CATEGORY.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Mục hồ sơ bệnh nhân'
  },
  {
    name: 'Bệnh nhân',
    url: ROUTES.DENTIST.children.PATIENT.children.LIST.fullPath,
    iconComponent: { name: 'cil-address-book' },
  },
]
