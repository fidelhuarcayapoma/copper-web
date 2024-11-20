import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../../shared/interfaces/status.interface';
import { MiningUnit } from '../../../mining-unit/interfaces/mining-unit.interface';
import { Area } from '../../interfaces/area.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { StatusComponent } from '../../../../shared/components/status/status.component';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    StatusComponent
  ],
  templateUrl: './area-form.component.html',
  styleUrl: './area-form.component.scss'
})
export class AreaFormComponent {
  @Input() submitted: boolean = false;
  @Input() miningUnits: MiningUnit[] = [];
  @Input() statuses: Status[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() areaForm!: FormGroup;

  _area: Area | null = null;

  @Input() set area(value: Area | null) {
    this._area = value;
    this.initForm();
  }

  get area(): Area | null {
    return this._area;
  }
  

  private initForm() {
    this.areaForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      miningUnitId: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null),
    });

    this.areaForm.reset();

    this.areaForm.patchValue({
      ...this.area,
      miningUnitId: this.area?.miningUnit?.id,
      statusId: this.area?.status?.id
    });
  }

  onSubmit() {
    if (this.areaForm.invalid) {
      this.submitted = true;
      this.areaForm.markAsDirty();

      return;
    }

    this.save.emit(this.areaForm);

  }

  onCancel() {
    this.cancel.emit();
  }
}
