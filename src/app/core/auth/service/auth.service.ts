import { Inject, inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../../interfaces/auth.interface';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from '../../services/local.storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit {
  public isInitialized = false;

  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  private router = inject(Router);
  private jwtHelper = inject(JwtHelperService);
  localStorageService = inject(LocalStorageService);
  private readonly isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    const storedUser = this.isBrowser ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(storedUser ? JSON.parse(storedUser) : null);
    
    this.currentUser = this.currentUserSubject.asObservable();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.msAuth}/auth/login`, { email: username, password: password })
      .pipe(map(user => {
        if (this.isBrowser && user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('_t', user.token);
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
  initialize(): Promise<void> {
    return new Promise((resolve) => {
      let user = null;
      
      if (this.isBrowser) {
        const userString = localStorage.getItem('currentUser');
        if (userString) {
          try {
            user = JSON.parse(userString);
          } catch (error) {
            console.error('Error parsing user data from localStorage', error);
          }
        }
      }
      
      this.currentUserSubject.next(user);
      resolve();
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.clear();
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login'], { queryParams: { message: 'Session expired' } });

  }

}
