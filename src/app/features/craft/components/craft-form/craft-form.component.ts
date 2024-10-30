import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../../shared/interfaces/status.interface';
import { Area } from '../../../area/interfaces/area.interface';
import { MiningUnit } from '../../../mining-unit/interfaces/mining-unit.interface';
import { Equipment } from '../../../equipment/interfaces/equipment.interface';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Craft } from '../../interfaces/craft.interface';
import { PRIMENG_MODULES } from '../../../../primeng.imports';

@Component({
  selector: 'app-craft-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PRIMENG_MODULES,
  ],
  templateUrl: './craft-form.component.html',
  styleUrl: './craft-form.component.scss'
})
export class CraftFormComponent {
  @Input() submitted: boolean = false;
  @Input() craft: Craft | null = null;
  @Input() equipments: Equipment[] = [];
  @Input() statuses: Status[] = [];
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() form!: FormGroup;

  ngOnInit() {
    this.initForm();
  }


  private initForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      equipmentId: new FormControl('', [Validators.required]),
      statusId: new FormControl('', [Validators.required]),
    });

    this.form.patchValue({
      ...this.craft,
      miningUnitId: this.craft?.equipment?.id,
      statusId: this.craft?.status?.id
    });
  }

  onSubmit() {


    if (this.form.valid) {
      this.save.emit(this.form);
    }else{
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          console.log(key, control.errors)
        }
      })
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
