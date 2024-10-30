import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../../shared/interfaces/status.interface';
import { Area } from '../../../area/interfaces/area.interface';
import { MiningUnit } from '../../../mining-unit/interfaces/mining-unit.interface';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../../../primeng.imports';
import { Craft } from '../../../craft/interfaces/craft.interface';
import { Document } from '../../interfaces/document.interface';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PRIMENG_MODULES,
  ],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.scss'
})
export class DocumentFormComponent {
  @Input() submitted: boolean = false;
  @Input() document: Document | null = null;
  @Input() crafts: Craft[] = [];
  @Input() statuses: Status[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() form!: FormGroup;

  ngOnInit() {
    this.initForm();
  }


  private initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required]),
      craftId: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
    });

    this.form.patchValue({
      ...this.document,
      craftId: this.document?.craft?.id,
      statusId: this.document?.status?.id
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAsDirty();

      return;
    }

    this.save.emit(this.form);

  }

  onCancel() {
    this.cancel.emit();
  }
}
