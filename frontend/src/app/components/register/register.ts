import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, 
  Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { MapComponent } from '../map/map';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MapComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  //userData = { username: '', email: '', password: '' };
  registerForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(3)]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator },
    ); // Aggiungi il validatore qui
  }
  
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { mismatch: true }
      : null;
  };

  onRegister() {
    console.log('Tentativo registrazione in corso...');

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log('Risposta server:', res);
        alert('Register Success!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400) {
          console.error('Dettaglio errore:', err);
          alert('Attenzione: questo utente esiste già');
        } else {
          console.error('Dettaglio errore:', err);
          alert('Errore del server. Riprova più tardi');
        }
      },
    });
  }
}
