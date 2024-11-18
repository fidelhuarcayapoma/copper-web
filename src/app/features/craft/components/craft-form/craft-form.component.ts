import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
    ...PRIMENG_MODULES,
  ],
  templateUrl: './craft-form.component.html',
  styleUrl: './craft-form.component.scss'
})
export class CraftFormComponent implements OnInit, OnChanges {
  @Input() submitted: boolean = false;
  @Input() craft: Craft | null = null;
  @Input() equipments: Equipment[] = [];
  @Input() statuses: Status[] = [];
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      equipmentId: new FormControl('', [Validators.required]),
      statusId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.updateFormValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['craft'] && !changes['craft'].firstChange) {
      this.updateFormValues();
    }
  }

  private updateFormValues() {
    if (this.craft) {
      this.form.patchValue({
        name: this.craft.name,
        equipmentId: this.craft.equipment?.id,
        statusId: this.craft.status?.id
      });
    }
  }

  onSubmit() {
      this.save.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }
}