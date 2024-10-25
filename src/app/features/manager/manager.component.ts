import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { MessageService, TreeNode } from 'primeng/api';
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


@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    TreeTableModule,
    CommonModule,
    StatusComponent,
    TypeIconPipe,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss'
})
export class ManagerComponent implements OnInit {
  private miningUnitService = inject(MiningUnitService);
  private areaService = inject(AreaService);
  private equipmentService = inject(EquipmentService);
  private craftService = inject(CraftService);
  private documentService = inject(DocumentService);
  private cd = inject(ChangeDetectorRef);
  private messageService = inject(MessageService); // Para mostrar mensajes de éxito/error

  files: TreeNode[] = [];
  cols: any[] = [];
  filterMode: string = 'strict';
  loading: boolean = false;
  displayDialog: boolean = false;
  newItemData: any = {};
  currentItemType: string = '';
  parentNode: TreeNode | null = null;

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Nombre' },
      { field: 'status', header: 'Estado' },
      { field: 'createdAt', header: 'Fecha Creación' },
      { field: 'actions', header: 'Acciones' }
    ];

    this.loadInitialData();
  }

  showCreateDialog(type: string, parent?: TreeNode) {
    this.currentItemType = type;
    this.parentNode = parent || null;
    this.newItemData = {
      name: '',
      status: 'ACTIVE',
      miningUnitId: this.parentNode?.data?.id ?? null  // Verifica que `data` esté presente
    };
    
    this.displayDialog = true;
  }

  // Método para guardar el nuevo elemento
  saveNewItem() {
    if (!this.newItemData.name) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es requerido'
      });
      return;
    }

    this.loading = true;
    let saveOperation: Observable<any>;

    switch (this.currentItemType) {
      case 'miningUnit':
        saveOperation = this.miningUnitService.createMiningUnit(this.newItemData);
        break;
      case 'area':
        this.newItemData.miningUnitId = this.parentNode?.data.id;
        saveOperation = this.areaService.createArea(this.newItemData);
        break;
      case 'equipment':
        this.newItemData.areaId = this.parentNode?.data.id;
        saveOperation = this.equipmentService.createEquipment(this.newItemData);
        break;
      case 'craft':
        this.newItemData.equipmentId = this.parentNode?.data.id;
        saveOperation = this.craftService.createCraft(this.newItemData);
        break;
      case 'document':
        this.newItemData.craftId = this.parentNode?.data.id;
        saveOperation = this.documentService.createDocument(this.newItemData);
        break;
      default:
        this.loading = false;
        return;
    }

    saveOperation.subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Elemento creado correctamente'
        });
        this.displayDialog = false;
        this.loading = false;
        
        // Recargar los datos del nodo padre si existe
        if (this.parentNode) {
          this.onNodeExpand({ node: this.parentNode });
        } else {
          this.loadInitialData();
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el elemento'
        });
        this.loading = false;
      }
    });
  }

  // Método para renderizar acciones según el tipo
  renderActions(rowData: any): string {
    let actions = '';
    
    switch (rowData.type) {
      case 'miningUnit':
        actions += `<button pButton icon="pi pi-plus" class="p-button-outlined p-button-success mr-2" 
                    (click)="showCreateDialog('area', node)"></button>`;
        break;
      case 'area':
        actions += `<button pButton icon="pi pi-plus" class="p-button-outlined p-button-success mr-2" 
                    (click)="showCreateDialog('equipment', node)"></button>`;
        break;
      case 'equipment':
        actions += `<button pButton icon="pi pi-plus" class="p-button-outlined p-button-success mr-2" 
                    (click)="showCreateDialog('craft', node)"></button>`;
        break;
      case 'craft':
        actions += `<button pButton icon="pi pi-plus" class="p-button-outlined p-button-success mr-2" 
                    (click)="showCreateDialog('document', node)"></button>`;
        break;
    }
    
    return actions;
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
            name: unit.name || 'Sin nombre',
            status: unit.status || 'INACTIVE',
            createdAt: unit.createdAt || new Date(),
            type: 'miningUnit',
            id: unit.id || ''
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

  // Método auxiliar para crear nodos del árbol
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

  // Método para obtener el ícono según el tipo de nodo
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
  

  private loadAreas(node: TreeNode) {
    this.areaService.getAreasByMiningUnitId(node.data.id).subscribe({
      next: (areas) => {
        node.children = areas.map(area => {
          const childNode = {
            data: {
              name: area.name,
              status: area.status,
              type: 'area',
              id: area.id
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
            name: equipment.name,
            status: equipment.status,
            createdAt: equipment.createdAt,
            type: 'equipment',
            id: equipment.id
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
            name: craft.name,
            status: craft.status,
            createdAt: craft.createdAt,
            type: 'craft',
            id: craft.id
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
            name: doc.name,
            status: doc.status,
            createdAt: doc.createdAt,
            type: 'document',
            id: doc.id,
            url: doc.url
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

  onGlobalFilter(tt: any, event: Event) {
    tt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openFile(rowData: any) {
    if (rowData.type === 'document' && rowData.url) {
      window.open(rowData.url, '_blank');
    }
  }

  reloadData() {
    this.loadInitialData();
  }
  
}
