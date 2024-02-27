import { Component } from '@angular/core';
import { isObject } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  template: '',
})
export class NotificationComponent {
  constructor(private notification: NzNotificationService) {}
  notify(type: string, title: string, error?: any): void {
    if (error?.error && isObject(error.error)) {
      let isShowed = false;
      for (const [key, value] of Object.entries(error.error)) {
        if (key === 'message') {
          isShowed = true;
          this.notification.create(type, title, value as string);
        }
      }
      if (!isShowed) this.notification.create(type, title, '');
    } else {
      this.notification.create(type, title, '');
    }
  }
}
