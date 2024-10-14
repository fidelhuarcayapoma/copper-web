import { Injectable } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { AuthService } from "../auth/service/auth.service";

@Injectable({
    providedIn: 'root',
  })
  export class AuthResolver {
    constructor(private authService: AuthService) {}
  
    resolve: ResolveFn<void> = () => {
      return this.authService.initialize();
    };
  }
  