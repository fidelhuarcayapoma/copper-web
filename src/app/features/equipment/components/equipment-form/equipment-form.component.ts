import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../../shared/interfaces/status.interface';
import { Area } from '../../../area/interfaces/area.interface';
import { MiningUnit } from '../../../mining-unit/interfaces/mining-unit.interface';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { PRIMENG_MODULES } from '../../../../primeng.imports';
import { StatusComponent } from '../../../../shared/components/status/status.component';
import { Equipment } from '../../interfaces/equipment.interface';

@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
  ],
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.scss'
})
export class EquipmentFormComponent {
  @Input() submitted: boolean = false;
  @Input() equipment: Equipment | null = null;
  @Input() areas: Area[] = [];
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
      areaId: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
    });

    this.form.patchValue({
      ...this.equipment,
      areaId: this.equipment?.area?.id,
      statusId: this.equipment?.status?.id
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
