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
        path: 'receptionist',
        fullPath: '/receptionist',
        children: {
            SCHEDULE: {
                path: 'schedule',
                fullPath: '/receptionist/schedule',
                children: {
                    WORK: {
                        path: 'work',
                        fullPath: '/receptionist/schedule/work',
                    },
                    APPOINTMENT: {
                        path: 'appointment',
                        fullPath: '/receptionist/schedule/appointment',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/schedule/appointment/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/receptionist/schedule/appointment/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/schedule/appointment/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/receptionist/schedule/appointment/${id}/edit`
                            }
                        }
                    }
                }
            },
            PRESCRIPTION: {
                path: 'prescription',
                fullPath: '/receptionist/prescription',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/receptionist/prescription/list'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/receptionist/prescription/${id}`
                    },
                }
            },
            PATIENT: {
                path: 'patient',
                fullPath: '/receptionist/patient',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/receptionist/patient/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/receptionist/patient/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/receptionist/patient/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/receptionist/patient/${id}/edit`
                    }
                }
            },
            EMPLOYEE: {
                path: 'employee',
                fullPath: '/receptionist/employee',
                children: {
                    DENTIST: {
                        path: 'dentist',
                        fullPath: '/receptionist/employee/dentist',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/employee/dentist/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/receptionist/employee/dentist/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/employee/dentist/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/receptionist/employee/dentist/${id}/edit`
                            }
                        }
                    },
                    ASSISTANT: {
                        path: 'assistant',
                        fullPath: '/receptionist/employee/assistant',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/employee/assistant/list'
                            },
                            CREATE: {
                                path: 'create',
                                fullPath: '/receptionist/employee/assistant/create'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/employee/assistant/${id}`
                            },
                            EDIT: {
                                path: ':id/edit',
                                fullPath: (id: string) => `/receptionist/employee/assistant/${id}/edit`
                            }
                        }
                    },
                }
            },
            PAYMENT: {
                path: 'bill',
                fullPath: '/receptionist/bill',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/receptionist/bill/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/receptionist/bill/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/receptionist/bill/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/receptionist/bill/${id}/edit`
                    }
                }
            },
            FACULTY: {
                path: 'faculty',
                fullPath: '/receptionist/faculty',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/receptionist/faculty/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/receptionist/faculty/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/receptionist/faculty/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/receptionist/faculty/${id}/edit`
                    }
                }
            },
            MATERIAL: {
                path: 'material',
                fullPath: '/receptionist/material',
                children: {
                    CONSUMABLE: {
                        path: 'consumable',
                        fullPath: '/receptionist/material/consumable',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/material/consumable/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/material/consumable/${id}`
                            },
                        }
                    },
                    FIXED: {
                        path: 'fixed',
                        fullPath: '/receptionist/material/fixed',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/material/fixed/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/material/fixed/${id}`
                            },
                        }
                    },
                    INGREDIENT: {
                        path: 'ingredient',
                        fullPath: '/receptionist/material/ingredient',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/material/ingredient/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/material/ingredient/${id}`
                            },
                        }
                    },
                    CATEGORY: {
                        path: 'category',
                        fullPath: '/receptionist/material/category',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/material/category/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/material/category/${id}`
                            },
                        }
                    }
                }
            },
            SERVICE: {
                path: 'service',
                fullPath: '/receptionist/service',
                children: {
                    DENTAL: {
                        path: 'dental',
                        fullPath: '/receptionist/service/dental',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/service/dental/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/service/dental/${id}`
                            },
                        }
                    },
                    CATEGORY: {
                        path: 'category',
                        fullPath: '/receptionist/service/category',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/receptionist/service/category/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/receptionist/service/category/${id}`
                            },
                        }
                    }
                }
            },
        }
    },
    DENTIST: {
        path: 'dentist',
        fullPath: '/dentist',
        children: {
            SCHEDULE: {
                path: 'schedule',
                fullPath: '/dentist/schedule',
                children: {
                    WORK: {
                        path: 'work',
                        fullPath: '/dentist/schedule/work',
                    },
                    APPOINTMENT: {
                        path: 'appointment',
                        fullPath: '/dentist/schedule/appointment',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/dentist/schedule/appointment/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/dentist/schedule/appointment/${id}`
                            },
                        }
                    }
                }
            },
            PRESCRIPTION: {
                path: 'prescription',
                fullPath: '/dentist/prescription',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/dentist/prescription/list'
                    },
                    CREATE: {
                        path: 'create',
                        fullPath: '/dentist/prescription/create'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/dentist/prescription/${id}`
                    },
                    EDIT: {
                        path: ':id/edit',
                        fullPath: (id: string) => `/dentist/prescription/${id}/edit`
                    }
                }
            },
            PATIENT: {
                path: 'patient',
                fullPath: '/dentist/patient',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/dentist/patient/list'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `/dentist/patient/${id}`
                    },
                }
            },
            MATERIAL: {
                path: 'material',
                fullPath: '/dentist/material',
                children: {
                    CONSUMABLE: {
                        path: 'consumable',
                        fullPath: '/dentist/material/consumable',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/dentist/material/consumable/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/dentist/material/consumable/${id}`
                            },
                        }
                    },
                    FIXED: {
                        path: 'fixed',
                        fullPath: '/dentist/material/fixed',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/dentist/material/fixed/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/dentist/material/fixed/${id}`
                            },
                        }
                    },
                    INGREDIENT: {
                        path: 'ingredient',
                        fullPath: '/dentist/material/ingredient',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/dentist/material/ingredient/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/dentist/material/ingredient/${id}`
                            },
                        }
                    },
                    CATEGORY: {
                        path: 'category',
                        fullPath: '/dentist/material/category',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/dentist/material/category/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/dentist/material/category/${id}`
                            },
                        }
                    }
                }
            },
            SERVICE: {
                path: 'service',
                fullPath: '/dentist/service',
                children: {
                    DENTAL: {
                        path: 'dental',
                        fullPath: '/dentist/service/dental',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/dentist/service/dental/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/dentist/service/dental/${id}`
                            },
                        }
                    },
                    CATEGORY: {
                        path: 'category',
                        fullPath: '/dentist/service/category',
                        children: {
                            LIST: {
                                path: 'list',
                                fullPath: '/dentist/service/category/list'
                            },
                            DETAIL: {
                                path: ':id',
                                fullPath: (id: string) => `/dentist/service/category/${id}`
                            },
                        }
                    }
                }
            },
        }
    },
}