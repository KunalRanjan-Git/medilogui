import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  
  constructor() {}

  success(message: string, title: string = 'Success') {
    Swal.fire(title, message, 'success');
  }

  error(message: string, title: string = 'Error') {
    Swal.fire(title, message, 'error');
  }

  warning(message: string, title: string = 'Warning') {
    Swal.fire(title, message, 'warning');
  }

  confirm(message: string, title: string = 'Are you sure?'): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => result.isConfirmed);
  }
}
