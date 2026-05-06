import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServicio } from '../../servicios/auth-servicio';
import { LoginResponse } from '../../modelos/login-response';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;
  errorMensaje: string = '';
  cargando: boolean = false;
  mostrarpassword: boolean = false;

  constructor(private fb: FormBuilder, private authServicio: AuthServicio, private router: Router){
    this.form = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)])
    });
  }

  togglePassword(): void {
    this.mostrarpassword = !this.mostrarpassword;
  }

  envio(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorMensaje = '';
    this.authServicio.login(this.form.value).subscribe({
      next: (datos: LoginResponse) => {
        const sesion: LoginResponse = {
          id: datos.id,
          nombre: datos.nombre,
          email: datos.email,
          rol: datos.rol,
          password: this.form.value.password
        };
        this.authServicio.guardarSesion(sesion);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMensaje = 'Email o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}
