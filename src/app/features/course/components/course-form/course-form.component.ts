import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '../../../../primeng.imports';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...PRIMENG_MODULES,
  ],
  providers: [DialogService, MessageService,],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent {
  @Input() form !: FormGroup;
  @Input() submitted !: boolean;
  @Input() showDialog !: boolean;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.form);
  }

  onCancel() {  
    this.cancel.emit();
  }
}
