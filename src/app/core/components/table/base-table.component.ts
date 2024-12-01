import { Component } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  template: ''
})
export class BaseTableComponent {
  
  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

  onColumnFilter(table: Table, field: string, event: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (field === 'name' || field === 'urlLogo') {
      table.filter(inputValue, field, 'contains');
    } else if (field === 'status.name') {
      table.filter(event.value, field, 'equals');
    }
  }
}
