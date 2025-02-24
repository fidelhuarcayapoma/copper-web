import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { StatusComponent } from '../../shared/components/status/status.component';
import { Equipment } from './interfaces/equipment.interface';
import { Area } from '../area/interfaces/area.interface';
import { Status } from '../../shared/interfaces/status.interface';
import { EquipmentService } from './service/equipmet.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StatusService } from '../../shared/service/status.service';
import { AreaService } from '../area/services/area.service';
import { Table } from 'primeng/table';
import { MiningUnitService } from '../mining-unit/services/mining-unit.service';
import { MiningUnit } from '../mining-unit/interfaces/mining-unit.interface';
import { EquipmentFormComponent } from './components/equipment-form/equipment-form.component';
import { CrudComponent } from '../../core/components/crud/crud';
import { FORM_MODULES } from '../../form-config';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    ...FORM_MODULES,
    ToolbarModule,
    StatusComponent,
    EquipmentFormComponent,
  ], providers: [MessageService, ConfirmationService],

  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent extends CrudComponent<Equipment> {

  equipments: Equipment[] = [];
  areas: Area[] = [];
  statuses: Status[] = [];
  miningUnits: MiningUnit[] = [];

  equipmentForm!: FormGroup;
  equipmentDialog: boolean = false;
  selectedEquipment: Equipment | null = null;
  constructor(
    private equipmentService: EquipmentService,
    private areaService: AreaService,
    private statusService: StatusService,
    private miningUnitService: MiningUnitService,
  ) {
    super();
  }

  override ngOnInit() {
    this.loadAreas();
    this.loadEquipment();
    this.loadStatuses();
  }



  loadAreas() {
    this.areaService.getAreas().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (error) => {
        console.error('Error loading areas', error);
      }
    });
  }
  loadEquipment() {
    this.equipmentService.getAll().subscribe({
      next: (data) => {
        this.equipments = data;
      },
      error: (error) => {
        console.error('Error loading equipment', error);
      }
    });
  }


  loadStatuses() {
    this.statusService.getAll().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error('Error loading statuses', error);
      }
    });
  }



  deleteEquipment(equipment: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Equipment?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.equipmentService.deleteEquipment(equipment.id).subscribe(
          () => {
            this.equipments = this.equipments.filter(val => val.id !== equipment.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipment Deleted', life: 3000 });
          },
          (error) => {
            console.error('Error deleting equipment', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Equipment', life: 3000 });
          }
        );
      }
    });
  }

  editEquipment(equipment: Equipment) {
    this.equipmentForm.patchValue({
      ...equipment,
      areaId: equipment?.area?.id,
      statusId: equipment?.status?.id
    });
    this.equipmentDialog = true;
    this.selectedEquipment = equipment;
  }

  saveEquipment(form: FormGroup) {
    this.submitted = true;
    this.equipmentForm = form;
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAsDirty();
      return;

    }
    const equipmentData = this.equipmentForm.value;
    if (this.selectedEquipment?.id) {
      this.equipmentService.updateEquipment(this.selectedEquipment.id, equipmentData).subscribe({
        next: (result) => {
          this.loadEquipment();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipment Updated', life: 3000 });
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating equipment', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Equipment', life: 3000 });
        }
      });
    } else {
      this.equipmentService.createEquipment(equipmentData).subscribe({
        next: (result) => {
          this.loadEquipment();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipment Created', life: 3000 });
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error creating equipment', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Equipment', life: 3000 });
        }
      }
      );
    }

    this.equipmentDialog = false;

  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.equipments.length; i++) {
      if (this.equipments[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }


  changeMiningUnit(event: any) {
    this.areaService.getAreasByMiningUnitId(event.value).subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (error) => {
        console.error('Error loading areas', error);
      }
    });
  }

  override loadItems(): void {
    this.loadEquipment();
  }
  override deleteItem(id: number): void {
    this.deleteEquipment(id);
  }

  override hideDialog(): void {
    this.dialogVisible = false;
  }
}
