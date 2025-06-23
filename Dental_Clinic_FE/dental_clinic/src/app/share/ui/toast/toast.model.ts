export type ToastType = 'success' | 'error' | 'info' | 'warning' ;

export interface ToastMessage {
    id?: string;
    title?: string;
    body: string;
    time?: string;
    type?: ToastType;
    autohide?: boolean;
    delay?: number;
    progress?: boolean;
}