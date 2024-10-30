import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MiningUnit } from '../mining-unit/interfaces/mining-unit.interface';
import { Status } from '../../shared/interfaces/status.interface';
import { Component, inject, OnInit } from '@angular/core';
import { StatusService } from '../../shared/service/status.service';
import { MiningUnitService } from '../mining-unit/services/mining-unit.service';
import { Area } from './interfaces/area.interface';
import { AreaService } from './services/area.service';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { StatusComponent } from '../../shared/components/status/status.component';
import { Table } from 'primeng/table';
import { CrudComponent } from '../../core/components/crud/crud';
import { AreaFormComponent } from './components/area-form/area-form.component';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
    AreaFormComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent extends CrudComponent<Area> implements OnInit {
  miningUnits: MiningUnit[] = [];
  statuses: Status[] = [];

  private areaService = inject(AreaService);
  private miningUnitService = inject(MiningUnitService);
  private statusService = inject(StatusService);

  constructor() {
    super(inject(MessageService), inject(ConfirmationService));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadMiningUnits();
    this.loadStatuses();
  }

  loadItems() {
    this.areaService.getAreas().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Error loading areas', error);
        this.showErrorMessage('Error al cargar las áreas');
      }
    });
  }

  private loadMiningUnits() {
    this.miningUnitService.getMiningUnits().subscribe({
      next: (data) => this.miningUnits = data,
      error: (error) => {
        console.error('Error loading mining units', error);
        this.showErrorMessage('Error al cargar las unidades mineras');
      }
    });
  }

  private loadStatuses() {
    this.statusService.getAll().subscribe({
      next: (data) => this.statuses = data,
      error: (error) => {
        console.error('Error loading statuses', error);
        this.showErrorMessage('Error al cargar los estados');
      }
    });
  }

  editArea(area: Area) {
    this.selectedItem = area;
    this.dialogVisible = true;
  }

  saveArea(areaData: any) {
    if (this.selectedItem?.id) {
      this.areaService.updateArea(this.selectedItem.id, areaData).subscribe({
        next: () => {
          this.loadItems();
          this.showSuccessMessage('Área Actualizada');
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating area', error);
          this.showErrorMessage('Error al actualizar el área');
        }
      });
    } else {
      this.areaService.createArea(areaData).subscribe({
        next: () => {
          this.loadItems();
          this.showSuccessMessage('Área Creada');
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error creating area', error);
          this.showErrorMessage('Error al crear el área');
        }
      });
    }
  }

  deleteItem(id: number) {
    this.areaService.deleteArea(id).subscribe({
      next: () => {
        this.loadItems();
        this.showSuccessMessage('Área Eliminada');
      },
      error: (error) => {
        console.error('Error deleting area', error);
        this.showErrorMessage('Error al eliminar el área');
      }
    });
  }
}