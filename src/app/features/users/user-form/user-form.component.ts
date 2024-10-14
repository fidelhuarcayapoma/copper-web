import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../interface/user.interface';
import { UsersService } from '../service/users.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

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
  providers:[
    DialogService 
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  @Input() user: User | null = null;
  @Output() onClose = new EventEmitter<User>();

  userForm: FormGroup;
  roles: { id: number; description: string }[] = [
    { id: 1, description: 'Admin' },
    { id: 2, description: 'User' },
    { id: 3, description: 'Viewer' },
  ];
  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      secondLastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [null, Validators.required], // Validación para que sea obligatorio seleccionar un rol
    });
  }

  ngOnInit() {
    if (this.user) {
      this.userForm.patchValue(this.user); // Si es edición, rellenar los campos
    }
  }

  save() {
    if (this.userForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const userData = this.userForm.value;

    if (this.user) {
      // Editar usuario
      this.usersService.updateUser(this.user.id, userData).subscribe((updatedUser: User) => {
        this.onClose.emit(updatedUser);
      });
    } else {
      console.log('Formulario inválido xxx');

      this.usersService.createUser(userData).subscribe((newUser: User) => {
        this.onClose.emit(newUser);
      });
    }
  }

  cancel() {
    this.onClose.emit(undefined); // Cerrar el modal sin guardar
  }
}
