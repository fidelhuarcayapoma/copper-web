import { Component, inject, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BaseTableComponent } from '../table/base-table.component';

@Component({
  template: ''
})
export abstract class CrudComponent<T extends { id: number }> extends BaseTableComponent implements OnInit {
  items: T[] = [];
  selectedItem: T | null = null;
  submitted: boolean = false;
  dialogVisible: boolean = false;

  protected messageService = inject(MessageService);
  protected confirmationService = inject(ConfirmationService);
  constructor() {
    super();
  }

  ngOnInit() {
    this.loadItems();
  }

  abstract loadItems(): void;
  abstract deleteItem(id: number): void;
  
  openNew() {
    this.submitted = false;
    this.dialogVisible = true;
    this.selectedItem = null;
  }

  hideDialog() {
    this.dialogVisible = false;
    this.submitted = false;
  }

  protected showSuccessMessage(detail: string) {
    this.messageService.add({ severity: 'success', summary: 'Successful', detail, life: 3000 });
  }

  protected showErrorMessage(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 3000 });
  }

  confirmDelete(item: T, itemName: string) {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar ${itemName}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItem(item.id);
      }
    });
  }
}