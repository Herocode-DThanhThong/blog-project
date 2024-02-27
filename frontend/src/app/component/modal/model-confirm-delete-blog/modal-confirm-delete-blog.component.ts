import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  importProvidersFrom,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  imports: [
    NzModalModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './modal-confirm-delete-blog.component.html',
})
export class ModalConfirmComponent {
  isVisible: BooleanInput;
  idBlog: number | null;

  @Output()
  isOk: EventEmitter<number | null> = new EventEmitter<number | null>();

  constructor() {
    this.isVisible = false;
    this.idBlog = null;
  }

  handleOk(): void {
    this.isOk.emit(this.idBlog);
  }

  handleCancel(): void {
    this.isOk.emit(null);
    this.isVisible = false;
    this.idBlog = null;
  }
}
