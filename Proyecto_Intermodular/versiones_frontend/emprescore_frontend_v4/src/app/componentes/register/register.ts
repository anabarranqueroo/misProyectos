import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServicio } from '../../servicios/auth-servicio';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form: FormGroup;
  errorMensaje: string = '';
  cargando: boolean = false;
  tipoRegistro: string = 'USER';
  mostrarPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private authServicio: AuthServicio, private router: Router) {
    this.form = this.fb.group({
      nombre: this.fb.control('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.control('', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i)]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
      confirmarPassword: this.fb.control('', [Validators.required])
    }, { validators: this.passwordsIguales });
  }

  ngOnInit(): void {
    const tipo = this.route.snapshot.paramMap.get('tipo');
    if (tipo === 'empresa') {
      this.tipoRegistro = 'EMPRESA';
    } else {
      this.tipoRegistro = 'USER';
    }
  }

  passwordsIguales(form: any) {
    const password = form.get('password')?.value;
    const confirmar = form.get('confirmarPassword')?.value;
    return password === confirmar ? null : { noCoinciden: true };
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirmarPassword(): void {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }

  seleccionarTipo(tipo: string): void {
    this.tipoRegistro = tipo;
  }

  envio(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorMensaje = '';
    const datos = {
      nombre: this.form.value.nombre,
      email: this.form.value.email,
      password: this.form.value.password
    }
    const llamada = this.tipoRegistro === 'EMPRESA' ? this.authServicio.registerEmpresa(datos) : this.authServicio.register(datos);
    llamada.subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMensaje = err.console.error?.message || 'Error al registrarse';
        this.cargando = false;
      }
    });
  }
}
