import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-craft',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './craft.component.html',
  styleUrls: ['./craft.component.scss'],
})
export class CraftComponent implements OnInit {
  crafts: Craft[] = [];
  equipments: Equipment[] = [];
  statuses: Status[] = [];
  craftForm: FormGroup;
  isEditing = false;
  selectedCraft: Craft | null = null;
  submitted = false;
  craftDialog: boolean = false;

  constructor(
    private craftService: CraftService,
    private equipmentService: EquipmentService,
    private statusService: StatusService,
    private messageService: MessageService
  ) {
    this.craftForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      equipmentId: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadCrafts();
    this.loadEquipments();
    this.loadStatuses();
  }

  loadCrafts() {
    this.craftService.getCrafts().subscribe({
      next: (data) => {
        this.crafts = data;
      },
      error: (error) => {
        console.error('Error loading crafts', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load crafts',
        });
      },
    });
  }

  loadEquipments() {
    this.equipmentService.getAll().subscribe({
      next: (data) => {
        this.equipments = data;
      },
      error: (error) => {
        console.error('Error loading equipments', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load equipments',
        });
      },
    });
  }

  loadStatuses() {
    this.statusService.getAll().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error('Error loading statuses', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load statuses',
        });
      },
    });
  }

  onSubmit() {
    if (this.craftForm.valid) {
      this.saveCraft();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
    }
  }

  createCraft() {
    if (!this.craftForm.valid) {
      this.submitted = true;
      this.craftForm.markAsDirty();
      return;
    }
    const craft = this.craftForm.getRawValue();
    console.log('Craft:', craft);
    this.craftService.createCraft(craft).subscribe({

      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Craft created successfully',
        });
        this.loadCrafts();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating craft', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create craft',
        });
      },
    });
  }

  updateCraft() {
    if (!this.selectedCraft) return;
    if (!this.craftForm.valid) {
      this.submitted = true;
      this.craftForm.markAsDirty();
      return;
    }
    const updatedCraft = { ...this.selectedCraft, ...this.craftForm.value };
    this.craftService.updateCraft(updatedCraft).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Craft updated successfully',
        });
        this.loadCrafts();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error updating craft', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update craft',
        });
      },
    });
  }

  editCraft(craft: Craft) {
    this.isEditing = true;
    this.selectedCraft = craft;
    this.craftForm.patchValue(craft);
    this.craftDialog = true;
  }

  deleteCraft(id: number) {
    this.craftService.deleteCraft(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Craft deleted successfully',
        });
        this.loadCrafts();
      },
      error: (error) => {
        console.error('Error deleting craft', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete craft',
        });
      },
    });
  }

  resetForm() {
    this.isEditing = false;
    this.selectedCraft = null;
    this.craftForm.reset();
    this.craftDialog = false;
  }

  openNew() {
    this.resetForm();
    this.craftDialog = true;
  }

  saveCraft() {
    if (this.isEditing) {
      this.updateCraft();
    } else {
      this.createCraft();
    }
    this.craftDialog = false;
  }

  hideDialog() {
    this.craftDialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
