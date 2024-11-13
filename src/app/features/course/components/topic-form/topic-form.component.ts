import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '../../../../primeng.imports';

@Component({
  selector: 'app-topic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...PRIMENG_MODULES,
  ],
  templateUrl: './topic-form.component.html',
  styleUrl: './topic-form.component.scss'
})
export class TopicFormComponent {
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
