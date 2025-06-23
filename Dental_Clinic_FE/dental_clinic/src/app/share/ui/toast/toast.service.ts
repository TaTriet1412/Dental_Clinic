import { BehaviorSubject } from "rxjs";
import { ToastMessage } from "./toast.model";

export class ToastService {
    private _toasts = new BehaviorSubject<ToastMessage[]>([]);
    public toasts$ = this._toasts.asObservable();
    show(toast: ToastMessage): void {
        toast.id = toast.id || Date.now().toString() + Math.random().toString(36).substring(2, 8);
        const currentToasts = this._toasts.getValue();
        this._toasts.next([...currentToasts, toast]);
    }

    remove(toast: ToastMessage): void {
        const currentToasts = this._toasts.getValue();
        this._toasts.next(currentToasts.filter(t => t !== toast));
    }

    clear(): void {
        this._toasts.next([]);
    }
}