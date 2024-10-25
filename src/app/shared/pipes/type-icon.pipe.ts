import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'typeIcon',
    standalone: true
  })
  export class TypeIconPipe implements PipeTransform {
    transform(type: string): string {
      switch (type) {
        case 'miningUnit': return 'pi pi-building';
        case 'area': return 'pi pi-building-columns';
        case 'equipment': return 'pi pi-briefcase';
        case 'craft': return 'pi pi-folder-open';
        case 'document': return 'pi pi-file';
        default: return 'pi pi-folder';
      }
    }
  }