import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { BlogEdit } from '../../../response/blog';
@Component({
  selector: 'app-modal-edit-blog',
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
  templateUrl: './modal-edit-blog.component.html',
})
export class ModalEditBlogComponent {
  isVisible: BooleanInput;

  data: BlogEdit;

  @Output()
  editData: EventEmitter<BlogEdit> = new EventEmitter<BlogEdit>();

  constructor() {
    this.isVisible = false;
    this.data = {};
  }

  handleOk(): void {
    this.editData.emit(this.data);
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
