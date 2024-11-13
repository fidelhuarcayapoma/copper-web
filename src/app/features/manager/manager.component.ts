import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { MessageService, TreeNode, TreeTableNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Area } from '../area/interfaces/area.interface';
import { Craft } from '../craft/interfaces/craft.interface';
import { CraftService } from '../craft/services/craft.service';
import { DocumentService } from '../document/services/document.service';
import { Equipment } from '../equipment/interfaces/equipment.interface';
import { EquipmentService } from '../equipment/service/equipmet.service';
import { MiningUnit } from '../mining-unit/interfaces/mining-unit.interface';
import { Document } from '../document/interfaces/document.interface';
import { MiningUnitService } from '../mining-unit/services/mining-unit.service';
import { switchMap, forkJoin, map, Observable } from 'rxjs';
import { AreaService } from '../area/services/area.service';
import { StatusComponent } from '../../shared/components/status/status.component';
import { TypeIconPipe } from '../../shared/pipes/type-icon.pipe';
import { AreaFormComponent } from '../area/components/area-form/area-form.component';
import { MiningUnitFormComponent } from '../mining-unit/components/mining-unit-form/mining-unit-form.component';
import { DocumentFormComponent } from '../document/components/document-form/document-form.component';
import { EquipmentFormComponent } from '../equipment/components/equipment-form/equipment-form.component';
import { CraftFormComponent } from '../craft/components/craft-form/craft-form.component';
import { DialogModule } from 'primeng/dialog';
import { Status } from '../../shared/interfaces/status.interface';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { StatusService } from '../../shared/service/status.service';
import { Column } from '../../core/interfaces/column.interface';
import { DialogService } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    DialogModule,
    TreeTableModule,
    CommonModule,
    ...PRIMENG_MODULES,
    StatusComponent,
    TypeIconPipe,
    AreaFormComponent,
    MiningUnitFormComponent,
    DocumentFormComponent,
    EquipmentFormComponent,
    CraftFormComponent,
  ],
  providers: [
    DialogService, MessageService,  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss'
})
export class ManagerComponent implements OnInit {
  private miningUnitService = inject(MiningUnitService);
  private areaService = inject(AreaService);
  private equipmentService = inject(EquipmentService);
  private craftService = inject(CraftService);
  private documentService = inject(DocumentService);
  private statusService = inject(StatusService);
  private cd = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  files: TreeNode[] = [];
  cols: Column[] = [];

  filterMode: string = 'strict';
  loading: boolean = false;
  displayDialog: boolean = false;
  newItemData: any = {};
  currentItemType: string = '';
  parentNode: TreeNode | null = null;
  items: any[] = [];
  statuses: Status[] = [];
  form: FormGroup = new UntypedFormGroup({});
  editItemData: any = {};
  isEditMode: boolean = false;

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nombre', sortable: true },
      { field: 'status', header: 'Estado', sortable: true },
      { field: 'createdAt', header: 'Fecha Creación', sortable: true },
      { field: 'actions', header: 'Acciones', sortable: false }
    ];

    this.loadInitialData();
  }

  showCreateDialog(type: string, parent?: TreeTableNode, itemData?: any) {
    this.currentItemType = type;
    this.parentNode = parent?.node || null;
    this.isEditMode = !!itemData;
    this.loadStatuses();
    this.form.reset();
    this.newItemData = itemData || {};

    this.displayDialog = true;

    switch (type) {
      case 'area':
        this.miningUnitService
          .getMiningUnits()
          .subscribe((res) => {
            this.items = res;
          })
        break;
      case 'miningUnit':
        break;
      case 'equipment': console.log(this.parentNode?.data);
        this.areaService
          .getAreas()
          .subscribe((res) => {
            this.items = res;
          })
        break;
      case 'craft':
        this.equipmentService
          .getAll()
          .subscribe((res) => {
            this.items = res;
          })
        break;
      case 'document':
        this.craftService
          .getCrafts()
          .subscribe((res) => {
            this.items = res;
          })
        break;
    }

  }

  saveNewItem(form: FormGroup) {
    const value = form.getRawValue();

    this.loading = true;
    let saveOperation: Observable<any>;

    if (this.isEditMode) {
      saveOperation = this.updateItem(value);
    } else {
      saveOperation = this.createNewItem(value);
    }
    saveOperation.subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.isEditMode ? 'Elemento actualizado correctamente' : 'Elemento creado correctamente'
        });
        this.displayDialog = false;
        this.loading = false;
        this.reloadData();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar el elemento'
        });
        this.loading = false;
      }
    });
  }

  private createNewItem(data: any): Observable<any> {
    switch (this.currentItemType) {
      case 'miningUnit': return this.miningUnitService.createMiningUnit(data);
      case 'area': return this.areaService.createArea(data);
      case 'equipment': return this.equipmentService.createEquipment(data);
      case 'craft': return this.craftService.createCraft(data);
      case 'document': return this.documentService.createDocument(data);
      default: throw new Error('Tipo de elemento desconocido');
    }
  }

  private updateItem(data: any): Observable<any> {
    const id = this.newItemData?.id;
    if (!id) {
      throw new Error('El elemento no tiene un ID');
    }
    data.id = id;

    switch (this.currentItemType) {
      case 'miningUnit': return this.miningUnitService.updateMiningUnit(id, data);
      case 'area': return this.areaService.updateArea(id, data);
      case 'equipment': return this.equipmentService.updateEquipment(id, data);
      case 'craft': return this.craftService.updateCraft(data);
      case 'document': return this.documentService.updateDocument(data);
      default: throw new Error('Tipo de elemento desconocido');
    }
  }

  deleteItem(item: TreeTableNode) {
    let deleteOperation: Observable<any>;
    console.log(item.node);
    const id = item.node?.data?.id;

    if (!id) {
      throw new Error('El elemento no tiene un ID');
    }

    switch (item.node?.data.type) {
      case 'miningUnit': deleteOperation = this.miningUnitService.deleteMiningUnit(id); break;
      case 'area': deleteOperation = this.areaService.deleteArea(id); break;
      case 'equipment': deleteOperation = this.equipmentService.deleteEquipment(id); break;
      case 'craft': deleteOperation = this.craftService.deleteCraft(id); break;
      case 'document': deleteOperation = this.documentService.deleteDocument(id); break;
      default: throw new Error('Tipo de elemento desconocido');
    }

    deleteOperation.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Elemento eliminado correctamente' });
        this.reloadData();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el elemento' });
      }
    });
  }


  loadInitialData() {
    this.loading = true;
    this.miningUnitService.getMiningUnits().subscribe({
      next: (miningUnits) => {
        try {
          if (!Array.isArray(miningUnits)) {
            throw new Error('La respuesta no es un array');
          }

          this.files = miningUnits.map(unit => this.createTreeNode({
            ...unit,
            type: 'miningUnit',
          }, false));

          this.loading = false;
          this.cd.markForCheck();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al procesar los datos de unidades mineras'
          });
          this.loading = false;
          this.files = [];
          this.cd.markForCheck();
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las unidades mineras'
        });
        this.loading = false;
        this.files = [];
        this.cd.markForCheck();
      }
    });
  }

  private createTreeNode(data: any, isLeaf: boolean): TreeNode {
    return {
      data: data,
      children: [],
      leaf: isLeaf,
      expanded: false,
      parent: undefined,
      icon: this.getNodeIcon(data.type),
      key: data.id
    };
  }

  private getNodeIcon(type: string): string {
    switch (type) {
      case 'miningUnit':
        return 'pi pi-building';
      case 'area':
        return 'pi pi-map';
      case 'equipment':
        return 'pi pi-cog';
      case 'craft':
        return 'pi pi-wrench';
      case 'document':
        return 'pi pi-file';
      default:
        return 'pi pi-folder';
    }
  }



  onNodeExpand(event: any) {
    const node = event.node;

    if (!node.data) {
      return;
    }

    if (!node.children || !node.children.length) {
      this.loading = true;

      switch (node.data.type) {
        case 'miningUnit':
          this.loadAreas(node);
          break;
        case 'area':
          this.loadEquipments(node);
          break;
        case 'equipment':
          this.loadCrafts(node);
          break;
        case 'craft':
          this.loadDocuments(node);
          break;
        default:
          this.loading = false;
      }
    }
  }

  getCurrentName() {
    switch (this.currentItemType) {
      case 'miningUnit': return 'Unidad minera';
      case 'area': return 'Área';
      case 'equipment': return 'Equipo';
      case 'craft': return 'Manual';
      case 'document': return 'Documento';
      default: return 'Tipo de elemento desconocido';
    }
  }


  private loadAreas(node: TreeNode) {
    this.areaService.getAreasByMiningUnitId(node.data.id).subscribe({
      next: (areas) => {
        node.children = areas.map(area => {
          const childNode = {
            data: {
              ...area,
              type: 'area'
            },
            leaf: false // No es hoja inicialmente
          };
          return childNode;
        });
        this.loading = false;
        this.files = [...this.files];
        this.cd.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  private loadEquipments(node: TreeNode) {
    this.equipmentService.getEquipmentsByAreaId(node.data.id).subscribe({
      next: (equipments) => {
        node.children = equipments.map(equipment => ({
          data: {
            ...equipment,
            type: 'equipment',
          },
          leaf: false
        }));
        this.loading = false;
        this.files = [...this.files];
        this.cd.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  private loadCrafts(node: TreeNode) {
    this.craftService.getCraftsByEquipmentId(node.data.id).subscribe({
      next: (crafts) => {
        node.children = crafts.map(craft => ({
          data: {
            ...craft,
            type: 'craft',
          },
          leaf: false
        }));
        this.loading = false;
        this.files = [...this.files];
        this.cd.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  private loadDocuments(node: TreeNode) {
    this.documentService.getDocumentsByCraftId(node.data.id).subscribe({
      next: (documents) => {
        node.children = documents.map(doc => ({
          data: {
            ...doc,
            type: 'document',
          },
          leaf: true
        }));
        this.loading = false;
        this.files = [...this.files];
        this.cd.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }
  loadStatuses() {
    if (this.statuses.length !== 0) {
      return;
    }
    this.statusService.getAll().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error('Error loading statuses', error);
      }
    });
  }

  onGlobalFilter(tt: any, event: Event) {
    tt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openFile(rowData: any) {
    if (rowData.type === 'document' && rowData.url) {
      window.open(rowData.url, '_blank');
    }
  }

  onCancel() {
    this.displayDialog = false; console.log(this.form.getRawValue());
  }

  reloadData() {
    this.loadInitialData();
  }

}
