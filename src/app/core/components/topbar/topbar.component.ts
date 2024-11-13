import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';  // Importar el Router para redirigir
import { LayoutService } from '../../services/app.layout.service';
import { MenuItem } from 'primeng/api';  // Importar MenuItem para configurar el menú
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';  // Importar el módulo del menú
import { ButtonModule } from 'primeng/button';  // Importar el módulo del botón
import { AuthService } from '../../auth/service/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { User } from '../../../features/users/interface/user.interface';
import { AppInfoService } from '../../services/app-info.service';
import { APP_INFO, AppInfo } from '../../data/resource/app-info';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuModule,   // Importa MenuModule para usar el menú
    ButtonModule,
    AvatarModule,
    RippleModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  items: MenuItem[] = [];  
  firstChar: string = '';
  appInfoService = inject(AppInfoService);
  layoutService = inject(LayoutService);
  authService = inject(AuthService);
  router = inject(Router);
  appInfo: AppInfo = APP_INFO;


  ngOnInit() {
    // Configurar los elementos del menú
    this.items = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        command: () => this.goToProfile()  // Redirige al perfil del usuario
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()  // Llama al método de logout
      }
    ];

    this.authService.currentUser.subscribe(user => {
      this.firstChar = user?.username?.toUpperCase().charAt(0) || 'A';
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);  
  }


  logout() {
    this.authService.logout();  
    this.router.navigate(['/login']);  

  }
}
