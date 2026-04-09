import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ParseSourceFile } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginData={email:'', password:''};

  constructor(private http: HttpClient, private router:Router){}

  onLogin(){
    this.http.post('http://localhost:3000/api/login', this.loginData).subscribe({
      next: (res:any) => {
        alert('Bentornato!');
        
        localStorage.setItem('user', res.user.username);
        //this.router.navigate(['/home']);
      },
      error: (err) => {
        alert(err.error.message || 'Login Error');
      }
    });
  }
}
