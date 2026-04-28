import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private readonly USER_KEY = 'auth-user';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  //LOGIN
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: LoginResponse) => {
        console.log('RISPOSTA SERVER:', res);
        localStorage.setItem('token', res.token);
        this.loggedIn.next(true);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  logout() {
    this.loggedIn.next(false);
  }

  //REGISTRAZIONE
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  //RECUOPERO INFO UTENTE
  saveUser(user: any): void {
    window.localStorage.removeItem(this.USER_KEY);
    window.localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  
  getUser(): any {
    const user = window.localStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  getCurrentUserId(): string | null {
    const user = this.getUser();
    return user ? user.id : null;
  }
}
