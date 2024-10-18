import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { StatusComponent } from '../../shared/components/status/status.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StatusService } from '../../shared/service/status.service';
import { CraftService } from '../craft/services/craft.service';
import { Status } from '../../shared/interfaces/status.interface';
import { Craft } from '../craft/interfaces/craft.interface';
import { DocumentService } from './services/document.service';
import { Document } from './interfaces/document.interface';
import { UploadComponent } from "../../shared/components/upload/upload.component";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    CommonModule,
    ToolbarModule,
    ReactiveFormsModule,
    StatusComponent,
    UploadComponent
],
  providers: [
    MessageService,
    ConfirmationService,
  ],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent implements OnInit {
  documents: Document[] = [];
  crafts: Craft[] = [];
  statuses: Status[] = [];
  documentForm!: FormGroup;
  selectedDocument: Document | null = null;

  isEditing = false;
  documentDialog = false;
  submitted = false;

  constructor(
    private documentService: DocumentService,
    private craftService: CraftService,
    private statusService: StatusService,
    private messageService: MessageService
  ) {

  }

  ngOnInit() {
    this.loadDocuments();
    this.loadCrafts();
    this.loadStatuses();
    this.initForm();
  }

  initForm(): void {
    this.documentForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      craft: new FormControl('', [Validators.required]),
      status: new FormControl(null),
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

  onSubmit() {
    if (this.documentForm.valid) {
      if (this.isEditing) {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
    }
  }

  createDocument() {
    const document = this.documentForm.value;
    console.log(document);
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
    const document = this.documentForm.value;
    this.documentService.updateDocument(document).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document updated successfully' });
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
    this.documentForm.patchValue(document); 
    this.selectedDocument = document;
    this.documentDialog = true;
  }

  deleteDocument(id: number) {
    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document deleted successfully' });
        this.loadDocuments();
      },
      error: (error) => {
        console.error('Error deleting document', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete document' });
      }
    });
  }

  openNew() {
    this.submitted = false;
    this.documentDialog = true;
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
}
