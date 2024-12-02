import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FORM_MODULES } from '../../../../form-config';
import { PRIMENG_MODULES } from '../../../../primeng.imports';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    ...FORM_MODULES,
  ],
  templateUrl: './resource-form.component.html',
  styleUrl: './resource-form.component.scss'
})
export class ResourceFormComponent {
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
