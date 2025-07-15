import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoClose: boolean;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  constructor() {}

  show(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, autoClose: boolean = true, duration: number = 5000) {
    const toast: ToastMessage = {
      id: this.generateId(),
      type,
      title,
      message,
      autoClose,
      duration
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    if (autoClose) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  success(title: string, message: string, autoClose: boolean = true) {
    this.show('success', title, message, autoClose);
  }

  error(title: string, message: string, autoClose: boolean = true) {
    this.show('error', title, message, autoClose, 7000);
  }

  warning(title: string, message: string, autoClose: boolean = true) {
    this.show('warning', title, message, autoClose);
  }

  info(title: string, message: string, autoClose: boolean = true) {
    this.show('info', title, message, autoClose);
  }

  remove(id: string) {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  clear() {
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
