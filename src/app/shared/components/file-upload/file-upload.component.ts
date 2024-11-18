import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadError } from '../../interfaces/error.interface';
import { DragDropDirective } from '../../directives/drag-drop.directive';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../../primeng.imports';
import { FileSizePipe } from '../../pipes/file-size.pipe';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    DragDropDirective,
    CommonModule,
    ...PRIMENG_MODULES,
    FileSizePipe,
  ],
  providers: [MessageService],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() acceptedFileTypes: string[] = ['.pdf', '.docx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg'];
  @Input() maxFileSize: number = 5; // in MB
  @Input() multiple: boolean = true;
  @Input() maxFiles: number = 10;
  
  @Output() filesSelected = new EventEmitter<File[]>();

  files: File[] = [];
  messageService = inject(MessageService);

  onFileDropped(fileList: FileList): void {
    this.handleFiles(fileList);
  }

  dragover = false;

  uploadFiles() {
    this.filesSelected.emit(this.files);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(fileList: FileList): void {
    const newFiles = Array.from(fileList);
    const errors: FileUploadError[] = [];
    
    if (this.files.length + newFiles.length > this.maxFiles) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Se permiten un máximo de ${this.maxFiles} archivos`
      });
      return;
    }
    newFiles.forEach(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!this.acceptedFileTypes.includes(fileExtension)) {
        errors.push({
          file,
          error: `Tipo de archivo no válido. Tipos aceptados: ${this.acceptedFileTypes.join(', ')}`
        });
        return;
      }

      const fileSize = file.size / (1024 * 1024); // Convert to MB
      if (fileSize > this.maxFileSize) {
        errors.push({
          file,
          error: `El tamaño del archivo excede el límite de ${this.maxFileSize}MB`
        });
        return;
      }

      this.files.push(file);
    });

    errors.forEach(error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `${error.file.name}: ${error.error}`
      });
    });

    if (this.files.length > 0) {
      this.filesSelected.emit(this.files);
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.filesSelected.emit(this.files);
  }

  clearFiles(): void {
    this.files = [];
    this.filesSelected.emit(this.files);
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'ppt':
      case 'pptx':
        return 'pi pi-file-powerpoint';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'pi pi-image';
      default:
        return 'pi pi-file';
    }
  } 
}