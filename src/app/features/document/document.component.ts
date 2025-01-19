import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { StatusComponent } from '../../shared/components/status/status.component';
import { MessageService, ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { StatusService } from '../../shared/service/status.service';
import { CraftService } from '../craft/services/craft.service';
import { Status } from '../../shared/interfaces/status.interface';
import { Craft } from '../craft/interfaces/craft.interface';
import { DocumentService } from './services/document.service';
import { Document } from './interfaces/document.interface';
import { UploadComponent } from "../../shared/components/upload/upload.component";
import { Table } from 'primeng/table';
import { Area } from '../area/interfaces/area.interface';
import { Equipment } from '../equipment/interfaces/equipment.interface';
import { MiningUnit } from '../mining-unit/interfaces/mining-unit.interface';
import { AreaService } from '../area/services/area.service';
import { EquipmentService } from '../equipment/service/equipmet.service';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { DocumentFormComponent } from "./components/document-form/document-form.component";
import { FileUtil } from '../../shared/utils/file-util';
import { CrudComponent } from '../../core/components/crud/crud';
import { FORM_MODULES } from '../../form-config';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [
    ...FORM_MODULES,
    ToolbarModule,
    StatusComponent,
    FileUploadModule,
    ...PRIMENG_MODULES,
    DocumentFormComponent,
    TruncatePipe,
  ],
  providers: [
    MessageService,
    ConfirmationService,
  ],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent extends CrudComponent<Document> implements OnInit {

  
  documents: Document[] = [];
  equipments: Equipment[] = [];
  areas: Area[] = [];
  statuses: Status[] = [];
  miningUnits: MiningUnit[] = [];
  crafts: Craft[] = [];

  documentForm!: FormGroup;
  selectedDocument: Document | null = null;

  isEditing = false;
  documentDialog = false;

  files: File[] = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;

  private config = inject(PrimeNGConfig);
  private documentService = inject(DocumentService);
  private craftService = inject(CraftService);
  private statusService = inject(StatusService);

  override ngOnInit() {
    super.ngOnInit();
    this.loadStatuses();
    this.loadCrafts();
  }

  loadCrafts() {
    this.craftService.getCrafts().subscribe({
      next: (data) => {
        this.crafts = data;
      },
      error: (error) => {
        console.error('Error loading crafts', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load crafts' });
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load statuses' });
      }
    });
  }

  onSubmit(form: FormGroup) {
    this.documentForm = form;
    if (this.documentForm.valid) {
      if (this.isEditing) {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    } else {
      this.submitted = true;
      this.documentForm.markAsDirty();
    }
  }

  createDocument() {
    const document = this.documentForm.value;
    document.name = document.name.split('.')[0] +'.'+ FileUtil.getFileExtensionFromUrlDrive(document.url);

    this.documentService.createDocument(document).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document created successfully' });
        this.loadItems();
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error creating document', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create document' });
      }
    });
  }


  updateDocument() {
    let document = { ...this.documentForm.value, id: this.selectedDocument?.id };
    document.name = document.name.split('.')[0] +'.'+ FileUtil.getFileExtensionFromUrlDrive(document.url);
    this.documentService.updateDocument(document).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Documento actualizado exitosamente' });
        this.loadItems();
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error updating document', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update document' });
      }
    });
  }

  editDocument(document: Document) {
    this.isEditing = true;
    this.selectedDocument = { ...document };
    this.documentDialog = true;
    this.dialogVisible = true;
  }

  truncateUrlLogo(url: string): string {
    if (url && url.length > 30) {
      return url.substring(0, 27) + '...';
    }
    return url;
  }
  override loadItems(): void {
    this.documentService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data;
      },
      error: (error) => {
        console.error('Error loading documents', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load documents' });
      }
    });
  }  
override deleteItem(id: number): void {
  this.documentService.deleteDocument(id).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado exitosamente' });
      this.loadItems();
    },
    error: (error) => {
      console.error('Error deleting document', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el documento' });
    }
  });}



}
