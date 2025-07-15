import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}


  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getToastClass(type: string): string {
    const baseClass = 'toast fade show';
    switch (type) {
      case 'success':
        return `${baseClass} toast-success`;
      case 'error':
        return `${baseClass} toast-error`;
      case 'warning':
        return `${baseClass} toast-warning`;
      case 'info':
        return `${baseClass} toast-info`;
      default:
        return `${baseClass} toast-info`;
    }
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }

  getToastHeaderClass(type: string): string {
    switch (type) {
      case 'success':
        return 'toast-header-success';
      case 'error':
        return 'toast-header-error';
      case 'warning':
        return 'toast-header-warning';
      case 'info':
        return 'toast-header-info';
      default:
        return 'toast-header-info';
    }
  }

  trackByToastId(index: number, toast: ToastMessage): string {
    return toast.id;
  }
}
