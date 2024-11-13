import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '../../../../primeng.imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...PRIMENG_MODULES,

  ],
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.scss'
})
export class VideoFormComponent {
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
