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
  @Input() selectedItem: MiningUnit | null = null;
  @Input() miningUnits: MiningUnit[] = [];
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
      urlLogo: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
    });

    if (!this.selectedItem) {
      return;
    }

    this.form.patchValue({
      ...this.selectedItem,
      statusId: this.selectedItem.status.id,
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAsDirty();
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          console.log(key, control.errors)
        }
      })
      return;
    }

    this.save.emit(this.form);

  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
  }

  
}
