import { Component, ElementRef, inject } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuComponent } from '../menu/menu.component';
import { LayoutService } from '../../services/app.layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  layoutService = inject(LayoutService);
  el = inject(ElementRef);
}
