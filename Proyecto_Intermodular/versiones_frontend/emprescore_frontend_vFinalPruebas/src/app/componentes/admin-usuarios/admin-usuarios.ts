import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioServicio } from '../../servicios/usuario-servicio';
import { AuthServicio } from '../../servicios/auth-servicio';
import { Usuario } from '../../modelos/usuario';
import { RoleCountPipe } from '../../pipes/role-count.pipe';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-usuarios',
  imports: [CommonModule, RouterLink, RoleCountPipe, ReactiveFormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  cargando: boolean = false;
  mostrarConfirmacion: boolean = false;
  usuarioAEliminar: number | null = null;

  usuarioEditando: Usuario | null = null;
  guardandoUsuario: boolean = false;
  errorEdicion: string = '';
  formEdicion: FormGroup;

  constructor(private usuarioServicio: UsuarioServicio, public authServicio: AuthServicio, private fb: FormBuilder) {
    this.formEdicion = this.fb.group({
      nombre: this.fb.control('', [Validators.required, Validators.minLength(2)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      rol: this.fb.control('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioServicio.listar().subscribe({
      next: datos => {
        this.usuarios = datos;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar usuarios', err);
        this.cargando = false;
      }
    });
  }

  eliminarUsuario(id: number): void {
    this.usuarioAEliminar = id;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar(): void {
    if (this.usuarioAEliminar === null) return;
    this.usuarioServicio.borrar(this.usuarioAEliminar).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.mostrarConfirmacion = false;
        this.usuarioAEliminar = null;
      },
      error: err => console.error('Error al eliminar usuario', err)
    });
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
    this.usuarioAEliminar = null;
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEditando = usuario;
    this.errorEdicion = '';
    this.formEdicion.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });
  }

  cancelarEdicion(): void {
    this.usuarioEditando = null;
    this.errorEdicion = '';
    this.formEdicion.reset();
  }

  guardarEdicion(): void {
    if (this.formEdicion.invalid) {
      this.formEdicion.markAllAsTouched();
      return;
    }

    this.guardandoUsuario = true;
    this.errorEdicion = '';

    const cambios: Usuario = {
      id: this.usuarioEditando!.id,
      nombre: this.formEdicion.value.nombre,
      email: this.formEdicion.value.email,
      rol: this.formEdicion.value.rol,
      fecha_creacion: this.usuarioEditando!.fecha_creacion
    };

    this.usuarioServicio.editar(this.usuarioEditando!.id!, cambios).subscribe({
      next: () => {
        this.guardandoUsuario = false;
        this.usuarioEditando = null;
        this.cargarUsuarios();
      },
      error: (err) => {
        this.errorEdicion = err.error?.message || 'Error al editar usuario';
        this.guardandoUsuario = false;
      }
    });
  }
}
