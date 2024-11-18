import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../../shared/interfaces/status.interface';
import { Area } from '../../../area/interfaces/area.interface';
import { MiningUnit } from '../../../mining-unit/interfaces/mining-unit.interface';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../../../primeng.imports';
import { Craft } from '../../../craft/interfaces/craft.interface';
import { Document } from '../../interfaces/document.interface';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadComponent,
    ...PRIMENG_MODULES,
  
  ],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.scss'
})
export class DocumentFormComponent {
  @Input() submitted: boolean = false;
  @Input() document: Document | null = null;
  @Input() crafts: Craft[] = [];
  @Input() statuses: Status[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @Input() form!: FormGroup;


  selectedDocument: Document | null = null;

  isEditing = false;
  documentDialog = false;

  files: File[] = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;

  private config = inject(PrimeNGConfig);
  private messageService = inject(MessageService);
  ngOnInit() {
    this.initForm();
  }


  private initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required]),
      craftId: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
    });

    this.form.patchValue({
      ...this.document,
      craftId: this.document?.craft?.id,
      statusId: this.document?.status?.id
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAsDirty();

      return;
    }

    this.save.emit(this.form);

  }

  onCancel() {
    this.cancel.emit();
  }

  onSelectedFiles(event: any) {
    this.files = Array.from(event);console.log(this.files);
    this.form.patchValue({ files: this.files });
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  formatSize(bytes: number): string {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (!sizes || sizes.length === 0) {
      return `0 `;
    }

    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
}
