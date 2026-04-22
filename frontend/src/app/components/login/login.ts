import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormGroup, 
  FormControl, 
  Validators 
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MapComponent } from '../map/map';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    MapComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  // Dichiarazione del form
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inizializzazione del form con validatori
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required, 
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  /**
   * Gestisce l'invio del form di login
   */
  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Tentativo di login in corso...', this.loginForm.value);
      
      // Chiamata al metodo login dell'AuthService
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login effettuato con successo!', res);
        },
        error: (err) => {
          console.error('Errore durante il login:', err);
          if (err.status === 401) {
            alert('Credenziali non valide. Riprova.');
          } else {
            alert('Si è verificato un errore sul server.');
          }
        }
      });
    } else {
      // Evidenzia gli errori se il form è invalido
      this.loginForm.markAllAsTouched();
    }
  }
}