import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../../shared/interfaces/status.interface';
import { Area } from '../../../area/interfaces/area.interface';
import { MiningUnit } from '../../interfaces/mining-unit.interface';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { PRIMENG_MODULES } from '../../../../primeng.imports';
import { StatusComponent } from '../../../../shared/components/status/status.component';
import { CraftFormComponent } from '../../../craft/components/craft-form/craft-form.component';

@Component({
  selector: 'app-mining-unit-form',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
    CraftFormComponent,
  ],
  templateUrl: './mining-unit-form.component.html',
  styleUrl: './mining-unit-form.component.scss'
})
export class MiningUnitFormComponent {
  @Input() submitted: boolean = false;
  @Input() miningUnits: MiningUnit[] = [];
  @Input() statuses: Status[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() form!: FormGroup;

  _miningUnit: MiningUnit | null = null;

  @Input() set miningUnit(value: MiningUnit | null) {
    this._miningUnit = value;
    this.initForm();
  }

  get miningUnit(): MiningUnit | null {
    return this._miningUnit;
  }



  private initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      urlLogo: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
    });

    this.form.reset();
    this.form.patchValue({
      ...this.miningUnit,
      statusId: this.miningUnit?.status?.id,
    })
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
    this.form.reset();
    this.cancel.emit();
  }

  
}
