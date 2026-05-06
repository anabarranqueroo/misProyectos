import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthServicio } from '../../servicios/auth-servicio';
import { ResenaServicio } from '../../servicios/resena-servicio';
import { EmpresaServicio } from '../../servicios/empresa-servicio';
import { LoginResponse } from '../../modelos/login-response';
import { UsuarioServicio } from '../../servicios/usuario-servicio';
import { Resena } from '../../modelos/resena';
import { Empresa } from '../../modelos/empresa';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  sesion: LoginResponse | null = null;
  resenas: Resena[] = [];
  miEmpresa: Empresa | null = null;
  seccionActiva: string = 'info';
  cargando: boolean = false;

  mostrarFormPassword: boolean = false;
  enviandoPassword: boolean = false;
  errorPassword: string = '';
  exitoPassword: string = '';
  formPassword: FormGroup;
  mostrar: any = {
    passwordActual: false,
    passwordNueva: false,
    confirmarPassword: false
  };

  mostrarConfirmacionEliminar: boolean = false;
  borrandoCuenta: boolean = false;

  editandoPerfil: boolean = false;
  guardandoPerfil: boolean = false;
  errorPerfil: string = '';
  exitoPerfil: string = '';
  formPerfil: FormGroup;

  constructor(
    public authServicio: AuthServicio,
    private resenaServicio: ResenaServicio,
    private empresaServicio: EmpresaServicio,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioServicio: UsuarioServicio,
    private router: Router
  ) {
    this.formPassword = this.fb.group({
      passwordActual: this.fb.control('', [Validators.required]),
      passwordNueva: this.fb.control('', [Validators.required, Validators.minLength(6)]),
      confirmarPassword: this.fb.control('', [Validators.required])
    }, { validators: this.passwordsIguales });

    this.formPerfil = this.fb.group({
      nombre: this.fb.control('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.control('', [Validators.required, Validators.email])
    });
  }

  ngOnInit(): void {
    const seccion = this.route.snapshot.queryParamMap.get('seccion');
    if (seccion) {
      this.seccionActiva = seccion;
    }
    this.sesion = this.authServicio.obtenerSesion();
    if (this.sesion && this.sesion.id) {
      if (this.sesion.rol === 'USER') {
        this.cargarMisResenas();
      }
      if (this.sesion.rol === 'EMPRESA') {
        this.cargarMiEmpresa();
      }
    }
    this.formPerfil.patchValue({
      nombre: this.sesion?.nombre,
      email: this.sesion?.email
    });
  }

  toggle(campo: string): void {
    this.mostrar[campo] = !this.mostrar[campo];
  }

  abrirModalEliminar(): void {
    this.mostrarConfirmacionEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
  }

  confirmarEliminarCuenta(): void {
    if (!this.sesion || !this.sesion.id) return;
    this.borrandoCuenta = true;
    const empresaId = this.miEmpresa?.id;
    if (this.sesion.rol === 'EMPRESA' && empresaId) {
      this.empresaServicio.borrar(empresaId).subscribe({
        next: () => this.limpiarResenasYBorrarUsuario(),
        error: () => this.finalizarErrorBorrado('Error al borrar los datos de la empresa vinculada.')
      });
    } else {
      this.limpiarResenasYBorrarUsuario();
    }
  }

  private limpiarResenasYBorrarUsuario(): void {
    if (!this.sesion || !this.sesion.id) return;
    const resenasValidas = this.resenas.filter(r => r && r.id !== undefined && r.id !== null);
    if (resenasValidas.length > 0) {
      const peticiones = resenasValidas.map(r => {
        const idResena = r.id as number;
        return this.resenaServicio.borrar(idResena).pipe(catchError(() => of(null)));
      });
      /**
       * Lanza todas las peticiones de borrado a la vez y 
       * espera a que TODAS terminen antes de pasar al siguiente paso.
       */
      forkJoin(peticiones).subscribe(() => this.ejecutarBorradoUsuario());
    } else {
      this.ejecutarBorradoUsuario();
    }
  }

  private ejecutarBorradoUsuario(): void {
    const idUsuario: number = this.sesion?.id ?? 0;
    if (idUsuario === 0) {
      this.finalizarErrorBorrado('Sesión no válida.');
      return;
    }
    this.usuarioServicio.borrar(idUsuario).subscribe({
      next: () => {
        this.borrandoCuenta = false;
        this.cerrarModalEliminar();
        this.authServicio.cerrarSesion();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.finalizarErrorBorrado('No se pudo eliminar el usuario. Es posible que existan registros asociados.');
      }
    });
  }

  private finalizarErrorBorrado(msj?: string): void {
    this.borrandoCuenta = false;
    alert(msj || 'Error: No se puede eliminar la cuenta.');
  }

  cargarMisResenas(): void {
    const idUsuario = this.sesion?.id ?? 0;
    if (idUsuario === 0) return;

    this.cargando = true;
    this.resenaServicio.listarPorUsuario(idUsuario).subscribe({
      next: datos => {
        this.resenas = datos;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  cargarMiEmpresa(): void {
    const userId = this.sesion?.id;
    if (!userId) return;

    this.empresaServicio.listar().subscribe({
      next: datos => {
        this.miEmpresa = datos.find(e => e.usuario?.id === userId) || null;
      },
      error: err => console.error(err)
    });
  }

  passwordsIguales(form: any) {
    const nueva = form.get('passwordNueva')?.value;
    const confirmar = form.get('confirmarPassword')?.value;
    return nueva === confirmar ? null : { noCoinciden: true };
  }

  toggleFormPassword(): void {
    this.mostrarFormPassword = !this.mostrarFormPassword;
    this.formPassword.reset();
    this.errorPassword = '';
    this.exitoPassword = '';
    this.mostrar = {
      passwordActual: false,
      passwordNueva: false,
      confirmarPassword: false
    };
  }

  cambiarPassword(): void {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }
    this.enviandoPassword = true;
    this.errorPassword = '';
    this.exitoPassword = '';
    this.usuarioServicio.cambiarPassword(this.sesion!.id, this.formPassword.value.passwordActual, this.formPassword.value.passwordNueva).subscribe({
      next: () => {
        this.enviandoPassword = false;
        this.exitoPassword = 'Contraseña actualizada correctamente. Redirigiendo al login...';
        setTimeout(() => {
          this.authServicio.cerrarSesion();
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.errorPassword = err.error?.message || 'Error al cambiar la contraseña';
        this.enviandoPassword = false;
      }
    });
  }

  toggleEditarPerfil(): void {
    this.editandoPerfil = !this.editandoPerfil;
    this.errorPerfil = '';
    this.exitoPerfil = '';
    if (this.editandoPerfil) {
      this.formPerfil.patchValue({
        nombre: this.sesion?.nombre,
        email: this.sesion?.email
      });
    }
  }

  guardarPerfil(): void {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }
    this.guardandoPerfil = true;
    this.errorPerfil = '';
    this.exitoPerfil = '';
    this.usuarioServicio.editarPerfil(this.sesion!.id, this.formPerfil.value.nombre, this.formPerfil.value.email).subscribe({
      next: () => {
        const sesionActualizada: LoginResponse = {
          id: this.sesion!.id,
          nombre: this.formPerfil.value.nombre,
          email: this.formPerfil.value.email,
          rol: this.sesion!.rol,
          password: this.sesion!.password
        };
        this.authServicio.guardarSesion(sesionActualizada);
        this.sesion = sesionActualizada;
        this.guardandoPerfil = false;
        this.exitoPerfil = 'Perfil actualizado correctamente.';
        this.editandoPerfil = false;
      },
      error: (err) => {
        this.errorPerfil = err.error?.message || 'Error al actualizar el perfil';
        this.guardandoPerfil = false;
      }
    });
  }

  estrellas(num: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < num ? 'bi-star-fill' : 'bi-star'
    );
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  cerrarSesion(): void {
    this.authServicio.cerrarSesion();
    this.sesion = null;
    this.router.navigate(['/login']);
  }
}