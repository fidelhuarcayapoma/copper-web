import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { AppleComponent } from "../../../shared/components/apple/apple.component";
import { GoogleComponent } from "../../../shared/components/google/google.component";
import { ButtonModule } from 'primeng/button';
import { PasswordComponent } from '../../../shared/password/password.component';
import { EmailComponent } from '../../../shared/email/email.component';
import { Message } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CheckboxModule,
    AppleComponent,
    GoogleComponent,
    EmailComponent,
    PasswordComponent,
    ButtonModule,
    MessagesModule, 
    PasswordModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  remember: boolean = false;
  loading: boolean = false;
  messages: Message[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ]),
      password: new FormControl(null, [Validators.required]),
      remember: new FormControl(null, [])
    });
    
  }

  onSubmit() { 
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.markAsDirty();
      return;
    }
    
    this.loading = true;
    
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/']);
          this.loading = false;
        },
        error: (err) => {
          this.messages = [];
          
          if (err?.error?.message) {
            this.messages.push({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message || 'Login failed'
            });
          }
  
          if (err?.error?.fieldErrors) {
            for (const [field, message] of Object.entries(err.error.fieldErrors)) {
              this.messages.push({
                severity: 'error',
                summary: `Error`,
                detail: typeof message === 'string' ? message : JSON.stringify(message)
              });
            }
          }
          
          this.loading = false;
        }
      });

      
  }
  
}
