export const ROUTES = {
    HOME: {
        path: '',
        fullPath: ''
    },
    NOT_FOUND: {
        path: 'not-found',
        fullPath: '/not-found'
    },
    SERVER_ERROR: {
        path: 'server-error',
        fullPath: '/server-error'
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
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/schedule/appointment/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/schedule/appointment/${id}/edit`
                            }
                        }
                    }
                }
            },
            EMPLOYEE: {
                path: 'employee',
                fullPath: '/admin/employee',
                children: {
                    RECEPTIONIST: {
                        path: 'receptionist',
                        fullPath: '/admin/employee/receptionist',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/employee/receptionist/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/employee/receptionist/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/employee/receptionist/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/employee/receptionist/${id}/edit`
                            }
                        }
                    },
                    DENTIST: {
                        path: 'dentist',
                        fullPath: '/admin/employee/dentist',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/employee/dentist/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/employee/dentist/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/employee/dentist/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/employee/dentist/${id}/edit`
                            }
                        }
                    },
                    ASSISTANT: {
                        path: 'assistant',
                        fullPath: '/admin/employee/assistant',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/employee/assistant/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/employee/assistant/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/employee/assistant/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/employee/assistant/${id}/edit`
                            }
                        }
                    },
                }
            },
            FACULTY: {
                path: 'faculty',
                fullPath: '/admin/faculty',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/admin/faculty/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/admin/faculty/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/admin/faculty/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/admin/faculty/${id}/edit`
                    }
                }
            },
            PATIENT: {
                path: 'patient',
                fullPath: '/admin/patient',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/admin/patient/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/admin/patient/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/admin/patient/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/admin/patient/${id}/edit`
                    }
                }
            },
            SERVICE: {
                path: 'service',
                fullPath: '/admin/service',
                children: {
                    DENTAL: {
                        path: 'dental',
                        fullPath: '/admin/service/dental',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/service/dental/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/service/dental/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/service/dental/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/service/dental/${id}/edit`
                            }
                        }
                    },
                    CATEGORY: {
                        path: 'category',
                        fullPath: '/admin/service/category',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/service/category/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/service/category/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/service/category/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/service/category/${id}/edit`
                            }
                        }
                    }
                }
            },
            MATERIAL: {
                path: 'material',
                fullPath: '/admin/material',
                children: {
                    CONSUMABLE: {
                        path: 'consumable',
                        fullPath: '/admin/material/consumable',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/material/consumable/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/material/consumable/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/material/consumable/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/material/consumable/${id}/edit`
                            }
                        }
                    },
                    FIXED: {
                        path: 'fixed',
                        fullPath: '/admin/material/fixed',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/material/fixed/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/material/fixed/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/material/fixed/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/material/fixed/${id}/edit`
                            }
                        }
                    },
                    INGREDIENT: {
                        path: 'ingredient',
                        fullPath: '/admin/material/ingredient',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/material/ingredient/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/material/ingredient/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/material/ingredient/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/material/ingredient/${id}/edit`
                            }
                        }
                    },
                    CATEGORY: {
                        path: 'category',
                        fullPath: '/admin/material/category',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/admin/material/category/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/admin/material/category/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/admin/material/category/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/admin/material/category/${id}/edit`
                            }
                        }
                    }
                }
            },
            PRESCRIPTION: {
                path: 'prescription',
                fullPath: '/admin/prescription',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/admin/prescription/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/admin/prescription/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/admin/prescription/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/admin/prescription/${id}/edit`
                    }
                }
            },
            PAYMENT: {
                path: 'bill',
                fullPath: '/admin/bill',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/admin/bill/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/admin/bill/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/admin/bill/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/admin/bill/${id}/edit`
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