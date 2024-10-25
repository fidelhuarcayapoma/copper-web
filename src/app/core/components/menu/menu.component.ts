import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../primeng.imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MenuModule } from 'primeng/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { LayoutService } from '../../services/app.layout.service';
import { MenuitemComponent } from '../menuitem/menuitem.component';
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [...PRIMENG_MODULES,
        FormsModule,
        MenuModule,
        SidebarModule,
        RippleModule,
        MenuitemComponent,
        CommonModule,
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

    model: any[] = [];

    layoutService = inject(LayoutService);


    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Administración',
                items: [
                    {
                        label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/users'],
                        
                    },
                    {
                        label: 'Administrar', icon: 'pi pi-fw pi-th-large', routerLink: ['/manager'],
                    },
                    {
                        label: 'Mantenimientos', icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Unidades Mineras', icon: 'pi pi-fw pi-building', routerLink: ['/mineral-units'],
                                
                                
                            },
                            {
                                label: 'Áreas', icon: 'pi pi-fw pi-building-columns', routerLink: ['/areas'],
                                
                            },
                            {
                                label: 'Equipos', icon: 'pi pi-fw pi-briefcase', routerLink: ['/equipments'],
                                
                                
                            },
                            {
                                label: 'Manuales', icon: 'pi pi-fw pi-book', routerLink: ['/crafts'],
                                
                                
                            },
                            {
                                label: 'Documentos', icon: 'pi pi-fw pi-file', routerLink: ['/documents'],
                                
                                
                            },

            
                        ]
                        
                    },
                ]
            },
            
        ];
    }
}
