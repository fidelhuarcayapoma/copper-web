import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
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

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,  // Inyectar AuthService para manejar la autenticación
    private router: Router  // Inyectar Router para la navegación
  ) {}

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

  // Método para redirigir al perfil del usuario
  goToProfile() {
    this.router.navigate(['/profile']);  // Cambia '/profile' por la ruta adecuada
  }

  // Método para manejar el logout
  logout() {
    this.authService.logout();  // Llamar al método de logout del servicio de autenticación
    this.router.navigate(['/login']);  // Redirigir al login después de cerrar sesión
  }


}
