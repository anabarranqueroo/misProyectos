import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioServicio } from '../../servicios/usuario-servicio';

@Component({
  selector: 'app-recuperar-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css',
})
export class RecuperarPassword {
  form: FormGroup;
  cargando: boolean = false;
  errorMensaje: string = '';
  exitoMensaje: string = '';
  mostrarNuevoPassword: boolean = false;
  mostrarConfirmar: boolean = false;

  constructor(private fb: FormBuilder, private usuarioServicio: UsuarioServicio, private router: Router) {
    this.form = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      passwordNueva: this.fb.control('', [Validators.required, Validators.minLength(6)]),
      confirmarPassword: this.fb.control('', [Validators.required])
    }, { validators: this.passwordsIguales });
  }

  passwordsIguales(form: any) {
    const nueva = form.get('passwordNueva')?.value;
    const confirmar = form.get('confirmarPassword')?.value;
    return nueva === confirmar ? null : { noCoinciden: true };
  }

  toggleNuevoPassword(): void {
    this.mostrarNuevoPassword = !this.mostrarNuevoPassword;
  }

  toggleConfirmar(): void {
    this.mostrarConfirmar = !this.mostrarConfirmar;
  }

  envio(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.usuarioServicio.resetPassword(this.form.value.email, this.form.value.passwordNueva).subscribe({
      next: () => {
        this.cargando = false;
        this.exitoMensaje = 'Contraseña actualizada correctamente. Redirigiendo al login...';
        setTimeout(() =>
          this.router.navigate(['/login']),
          2000);
      },
      error: (err) => {
        this.errorMensaje = err.error?.message || 'Email no encontrado';
        this.cargando = false;
      }
    });
  }
}
