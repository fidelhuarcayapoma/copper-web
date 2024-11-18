import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true,
})
export class DragDropDirective {
  @Input() acceptedFileTypes: string[] = [];
  @Input() maxFileSize: number = 25; // Default 25MB
  
  @Output() fileDropped = new EventEmitter<FileList>();
  
  @HostBinding('class.dragover') dragover = false;
  
  @Output() dragOver = new EventEmitter<boolean>();

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragover = true;
    this.dragOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragover = false;
    this.dragOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(files); // Emit all files dropped
    }
    this.dragover = false;
    this.dragOver.emit(false);
  }
}