import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { StatusComponent } from '../../shared/components/status/status.component';
import { Status } from '../../shared/interfaces/status.interface';
import { StatusService } from '../../shared/service/status.service';
import { Equipment } from '../equipment/interfaces/equipment.interface';
import { EquipmentService } from '../equipment/service/equipmet.service';
import { Craft } from './interfaces/craft.interface';
import { CraftService } from './services/craft.service';
import { Table } from 'primeng/table';
import { CrudComponent } from '../../core/components/crud/crud';
import { AreaService } from '../area/services/area.service';
import { MiningUnitService } from '../mining-unit/services/mining-unit.service';
import { CraftFormComponent } from './components/craft-form/craft-form.component';

@Component({
  selector: 'app-craft',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
    CraftFormComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './craft.component.html',
  styleUrls: ['./craft.component.scss'],
})
export class CraftComponent extends CrudComponent<Craft> implements OnInit {
  equipments: Equipment[] = [];
  statuses: Status[] = [];

  private craftService = inject(CraftService);
  private equipmentService = inject(EquipmentService);
  private statusService = inject(StatusService);

  constructor() {
    super(inject(MessageService), inject(ConfirmationService));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadEquipments();
    this.loadStatuses();
  }

  loadItems() {
    this.craftService.getCrafts().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Error loading crafts', error);
        this.showErrorMessage('Error al cargar los manuales');
      }
    });
  }

  private loadEquipments() {
    this.equipmentService.getAll().subscribe({
      next: (data) => this.equipments = data,
      error: (error) => {
        console.error('Error loading equipments', error);
        this.showErrorMessage('Error al cargar los equipos');
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

  editCraft(craft: Craft) {console.log(craft);
    this.selectedItem = craft;
    this.dialogVisible = true;
  }

  saveCraft(craftData: any) {
    if (this.selectedItem?.id) {
      this.craftService.updateCraft({ ...this.selectedItem, ...craftData }).subscribe({
        next: () => {
          this.loadItems();
          this.showSuccessMessage('Manual Actualizado');
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating craft', error);
          this.showErrorMessage('Error al actualizar el manual');
        }
      });
    } else {
      this.craftService.createCraft(craftData).subscribe({
        next: () => {
          this.loadItems();
          this.showSuccessMessage('Manual Creado');
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error creating craft', error);
          this.showErrorMessage('Error al crear el manual');
        }
      });
    }
  }

  deleteItem(id: number) {
    this.craftService.deleteCraft(id).subscribe({
      next: () => {
        this.loadItems();
        this.showSuccessMessage('Manual Eliminado');
      },
      error: (error) => {
        console.error('Error deleting craft', error);
        this.showErrorMessage('Error al eliminar el manual');
      }
    });
  }
}
