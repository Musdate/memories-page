import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export interface AlertOptions {
  title?: string;
  text: string;
  icon?: SweetAlertIcon;
  background?: string;
  color?: string;
  position?: 'top-end' | 'center' | 'bottom-end';
  timer?: number;
  showConfirmButton?: boolean;
  toast?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertService {

  show(options: AlertOptions) {
    Swal.fire({
      title: options.title ?? '',
      html: options.text,
      icon: options.icon ?? undefined,
      background: options.background ?? '#fff',
      color: options.color ?? '#333',
      position: options.position ?? 'top-end',
      timer: options.timer ?? undefined,
      timerProgressBar: true,
      showCloseButton: options.toast || false,
      toast: options.toast || false,
      showConfirmButton: options.showConfirmButton ?? false,
      showClass: { popup: 'animate__animated animate__fadeIn' },
    });
  }

  showError( options: AlertOptions ) {
    this.show({
      text: options.text,
      background: '#F8D7DA',
      color: '#842029',
      position: 'top-end',
      timer: options.timer,
      toast: options.toast,
      showConfirmButton: false,
    });
  }

  showSuccess( options: AlertOptions ) {
    this.show({
      text: options.text,
      background: '#D1E7DD',
      color: '#0F5132',
      position: 'top-end',
      timer: options.timer,
      toast: options.toast,
      showConfirmButton: false,
    });
  }

}