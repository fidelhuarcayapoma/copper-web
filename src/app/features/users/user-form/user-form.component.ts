import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Role, User } from '../interface/user.interface';
import { UsersService } from '../service/users.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { RoleService } from '../../../shared/service/role.service';
import { tap } from 'rxjs';
import { StatusService } from '../../../shared/service/status.service';
import { Status } from '../../../shared/interfaces/status.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    DropdownModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
  ],
  providers: [
    DialogService,
    RoleService,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  user: User | null = null;
  @Output() onClose = new EventEmitter<User>();

  userForm: FormGroup;
  roles: Role[] = [];
  statuses: Status[] = [];

  constructor(
    private usersService: UsersService,
    public config: DynamicDialogConfig,
    private roleService: RoleService,
    private statusService: StatusService,
    private ref: DynamicDialogRef,
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      secondLastName: new FormControl(''), // Añade segundo apellido en el form
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]), // Agrega el campo DNI
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', Validators.required),
      statusId: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.userForm.reset();
    this.user = this.config.data?.user || null;

    this.loadRoles();
    this.loadStatuses();

  }

  save() {
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;

    if (this.user) {
      this.usersService.updateUser(this.user.id, userData).subscribe((updatedUser: User) => {
        this.onClose.emit(updatedUser);
        this.ref?.close();
      });
    } else {
      this.usersService.createUser(userData).subscribe((newUser: User) => {
        this.onClose.emit(newUser); 
        this.ref?.close();


      });
    }
  }

  cancel() {
    this.onClose.emit(undefined); // Cerrar el modal sin guardar
  }

  loadRoles() {
    this.roleService.getAll()
      .subscribe((roles: Role[]) => {
        this.roles = roles;
        if (this.user) {

          this.userForm.patchValue({
            ...this.user,
            statusId: this.user.status.id,
            roleId: this.user.roles[0].id,

          });
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
      }
    });
  }
}
