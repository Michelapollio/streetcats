import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  userData = { username: '', email: '', password: '' };

  constructor(private http: HttpClient) {}

  onRegister() {
    console.log('il tasto è stato premuto');
    this.http.post('http://localhost:3000/api/register', this.userData).subscribe({
      next: (res) => alert('registration completed'),
      error: (err) => {
        if (err.status === 400) {
          alert('Attenzione: questo utente esiste già!');
        } else {
          alert("C'è stato un errore nel server.");
        }
      },
    });
  }
}
