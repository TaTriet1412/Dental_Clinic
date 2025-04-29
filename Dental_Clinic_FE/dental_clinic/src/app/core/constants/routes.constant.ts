export const ROUTES = {
    HOME: {
        path: '',
        fullPath: ''
    },
    NOT_FOUND: {
        path: 'not-found',
        fullPath: '/not-found'
    },
    USER: {
        path: 'user',
        fullPath: '/user',
        childer: {
            LOGIN: {
                path: 'login',
                fullPath: '/user/login'
            }
        }
    },
    ADMIN: {
        path: 'admin',
        fullPath: '/admin',
        children: {
            SCHEDULE: {
                path: 'schedule',
                fullPath: '/admin/schedule',
                children: {
                    WORK: {
                        path: 'work',
                        fullPath: '/admin/schedule/work',
                    },
                    APPOINTMENT: {
                        path: 'appointment',
                        fullPath: '/admin/schedule/appointment',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/schedule/appointment/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/schedule/appointment/create'
                            }
                        }
                    },
                    // ORDER: {
                    //     path: ':id/table-order',
                    //     fullPath: (id: string) =>
                    //         `/admin/tables/${id}/table-order`,
                    // },
                }
            },
            MENU: {
                path: 'menu',
                fullPath: '/admin/menu',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'admin/menu/list'
                    }
                }
            },
            BILL: {
                path: 'bills',
                fullPath: '/admin/bills',
                children: {
                    SHIFT: {
                        path: 'shift',
                        fullPath: '/admin/bills/shift'
                    },
                    DATE: {
                        path: 'date',
                        fullPath: '/admin/bills/date'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `admin/bills/${id}`
                    }
                }
            }
        }
    },
    RECEPTIONIST: {
        path: 'staff',
        fullPath: '/staff',
        children: {
            TABLE: {
                path: 'tables',
                fullPath: '/staff/tables',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/staff/tables/list'
                    },
                    ORDER: {
                        path: ':id/table-order',
                        fullPath: (id: string) =>
                            `/staff/tables/${id}/table-order`,
                    },
                    BILL: {
                        path: ':id/table-bill',
                        fullPath: (id: string) =>
                            `/staff/tables/${id}/table-bill`
                    }
                }
            },
            MENU: {
                path: 'menu',
                fullPath: '/staff/menu',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'staff/menu/list'
                    }
                }
            },
        }
    },
    DENTIST: {
        path: 'chef',
        fullPath: '/chef',
        children: {
            DISH: {
                path: 'dishes',
                fullPath: '/chef/dishes'
            },
            ORDER: {
                path: 'orders',
                fullPath: '/chef/orders',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'chef/orders/list'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `chef/orders/${id}`
                    }
                }
            }
        }
    }
}