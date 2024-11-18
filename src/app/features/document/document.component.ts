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

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
    UploadComponent,
    FileUploadModule,
    FileUploadComponent,
    ...PRIMENG_MODULES,
    DocumentFormComponent
],
  providers: [
    MessageService,
    ConfirmationService,
  ],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent implements OnInit {
  changeEquipment($event: DropdownChangeEvent) {
    throw new Error('Method not implemented.');
  }
  changeArea($event: DropdownChangeEvent) {
    throw new Error('Method not implemented.');
  }
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
  submitted = false;

  files: File[] = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;

  private config = inject(PrimeNGConfig);
  private messageService = inject(MessageService);
  private documentService = inject(DocumentService);
  private craftService = inject(CraftService);

  ngOnInit() {
    this.loadCrafts();
    this.loadDocuments();
    this.initForm();
  }

  initForm(): void {
    this.documentForm = new FormGroup({
      craftId: new FormControl(null, [Validators.required]),
      files: new FormControl([], [Validators.required]),
      statusId: new FormControl(null),
    });
  }

  loadDocuments() {
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

  onSubmit() {
    if (this.documentForm.valid) {
      if (this.isEditing) {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    } else {
      this.submitted = true;
      console.log('Form is invalid');
      Object.keys(this.documentForm.controls).forEach(key => {
        const control = this.documentForm.get(key);
        console.log(key, control?.errors);
      })
      this.documentForm.markAsDirty();
    }
  }

  createDocument() {
    const document = this.documentForm.value;console.log(document);
    this.documentService.createDocument(document).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document created successfully' });
        this.loadDocuments();
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error creating document', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create document' });
      }
    });
  }

  updateDocument() {
    const document = { ...this.documentForm.value, id: this.selectedDocument?.id };
    this.documentService.updateDocument(document).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Documento actualizado exitosamente' });
        this.loadDocuments();
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
    this.documentForm.patchValue({
      ...document,
      craftId: document?.craft?.id,
      statusId: document?.status?.id
    });
    this.selectedDocument = document;
    this.documentDialog = true;
  }

  deleteDocument(id: number) {
    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado exitosamente' });
        this.loadDocuments();
      },
      error: (error) => {
        console.error('Error deleting document', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el documento' });
      }
    });
  }

  openNew() {
    this.submitted = false;
    this.documentDialog = true;
    this.selectedDocument = null;
    this.isEditing = false;
  }
  hideDialog() {
    this.isEditing = false;
    this.documentDialog = false;
    this.documentForm.reset();
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  truncateUrlLogo(url: string): string {
    if (url && url.length > 30) {
      return url.substring(0, 27) + '...';
    }
    return url;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Archivo subido', life: 3000 });
  }




}
