import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MiningUnitService } from './services/mining-unit.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { MiningUnit } from './interfaces/mining-unit.interface';
import { StatusComponent } from '../../shared/components/status/status.component';
import { Table } from 'primeng/table';
import { Status } from '../../shared/interfaces/status.interface';
import { StatusService } from '../../shared/service/status.service';
import { MiningUnitFormComponent } from './components/mining-unit-form/mining-unit-form.component';

@Component({
  selector: 'app-mining-unit',
  standalone: true,
  imports: [...PRIMENG_MODULES,
    CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
    StatusComponent,
    MiningUnitFormComponent,
    FormsModule,
  ],
  providers: [MessageService, ConfirmationService, MiningUnitService],
  templateUrl: './mining-unit.component.html',
  styleUrl: './mining-unit.component.scss'
})
export class MiningUnitComponent implements OnInit {
  miningUnits: MiningUnit[] = [];
  miningUnitForm!: FormGroup;
  miningUnitDialog: boolean = false;
  submitted: boolean = false;
  selectedMiningUnit: MiningUnit | null = null;
  statuses: Status[] = [];
  filters: any = {};

  constructor(
    private miningUnitService: MiningUnitService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private statusService: StatusService,
  ) { }

  ngOnInit() {
    this.loadMiningUnits();
    this.loadStatuses();
    this.initForm();
    this.filters = {
      name: { value: null, matchMode: 'contains' },
      urlLogo: { value: null, matchMode: 'contains' },
      'status.name': { value: null, matchMode: 'equals' }
    };
  }

  initForm() {
    this.miningUnitForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      urlLogo: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, []),
    });
  }

  loadMiningUnits() {
    this.miningUnitService.getMiningUnits().subscribe({
      next: (data) => {
        this.miningUnits = data;
      },
      error: (error) => {
        console.error('Error loading mining units', error);
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
  openNew() {
    this.submitted = false;
    this.miningUnitDialog = true;
    this.initForm();
  }

  deleteSelectedMiningUnit(miningUnit: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Mining Unit?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.miningUnitService.deleteMiningUnit(miningUnit.id).subscribe(
          () => {
            this.miningUnits = this.miningUnits.filter(val => val.id !== miningUnit.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mining Unit Deleted', life: 3000 });
          },
          (error) => {
            console.error('Error deleting mining unit', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Mining Unit', life: 3000 });
          }
        );
      }
    });
  }

  editMiningUnit(miningUnit: MiningUnit) {
    this.miningUnitForm.patchValue({
      ...miningUnit
    });
    this.miningUnitDialog = true;
    this.selectedMiningUnit = miningUnit;
  }

  hideDialog() {
    this.miningUnitDialog = false;
    this.submitted = false;
    this.initForm();
  }

  saveMiningUnit(form: FormGroup) {
    this.submitted = true;
    this.miningUnitForm = form;

    if (this.miningUnitForm.valid) {
      const miningUnitData = this.miningUnitForm.value;
      if (this.selectedMiningUnit?.id) {
        this.miningUnitService.updateMiningUnit(this.selectedMiningUnit?.id, miningUnitData).subscribe({
          next: (result) => {
            this.loadMiningUnits();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mining Unit Updated', life: 3000 });
          },
          error: (error) => {
            console.error('Error updating mining unit', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Mining Unit', life: 3000 });
          }
        });
      } else {
        this.miningUnitService.createMiningUnit(miningUnitData).subscribe({
          next: (result) => {
            this.loadMiningUnits();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mining Unit Created', life: 3000 });
          },
          error: (error) => {
            console.error('Error creating mining unit', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Mining Unit', life: 3000 });
          }
        });
      }

      this.miningUnits = [...this.miningUnits];
      this.miningUnitDialog = false;
      this.initForm();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.miningUnits.length; i++) {
      if (this.miningUnits[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onColumnFilter(dt: Table, field: string, event: any) {
    if (field === 'name' || field === 'urlLogo') {
      dt.filter(event.target.value, field, 'contains');
    } else if (field === 'status.name') {
      dt.filter(event.value, field, 'equals');
    }
  }
  truncateUrlLogo(url: string): string {
    if (url && url.length > 30) {
      return url.substring(0, 27) + '...';
    }
    return url;
  }

  getSeverity(status: string) {
    switch (status) {
        case 'ACTIVE':
        case 'Activo':
            return 'success';
        case 'INACTIVE':
        case 'Inactivo':
            return 'danger';
        default:
            return 'info';
    }
}
}
