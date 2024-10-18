import { Component, computed, input } from '@angular/core';
import { Status } from '../../interfaces/status.interface';
import { StatusCode } from '../../common/status-code';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    StatusComponent,
    TagModule,
    CommonModule,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  status = input<Status>();
  statusCode = StatusCode;
  code = computed(() => this.status()?.code);
  description = computed(() => `${this.status()?.description}`);

}
