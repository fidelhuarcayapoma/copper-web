import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { User } from './interface/user.interface';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { UsersService } from './service/users.service';
import { UserFormComponent } from './user-form/user-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TablePageEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { StatusComponent } from "../../shared/components/status/status.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [...PRIMENG_MODULES, CommonModule, StatusComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    DialogService,
    UsersService,
    MessageService,
  ],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  usersService = inject(UsersService)
  modalService = inject(DialogService); // Inyectar el servicio del modal
  modalRef: DynamicDialogRef | undefined;
  changeDetectorRef = inject(ChangeDetectorRef);
  first = 0;
  isLoading = true;

  rows = 10;
  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAll().subscribe({
      next: (res) => {
        this.users = res;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  // Crear un nuevo usuario
  createUser() {
    this.modalRef = this.modalService.open(UserFormComponent, {
      data: { user: null }, // Pasar null para crear un nuevo usuario
      header: 'Crear Usuario',
    });

    this.modalRef.onClose.subscribe((result: User) => {
      if (result) {
        this.users.push(result);
        this.users = [...this.users];
        this.modalRef?.close();
      }
      this.loadUsers();
    });
  }

  updateUser(user: User) {
    this.modalRef = this.modalService.open(UserFormComponent, {
      data: { user }, // Pasar el usuario existente para editar
      header: 'Editar Usuario',

    });

    this.modalRef.onClose.subscribe((result: User) => {
      if (result) {
    
       
      } this.loadUsers();
    });
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: TablePageEvent) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.users ? this.first === this.users.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.users ? this.first === 0 : true;
  }
  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

}
