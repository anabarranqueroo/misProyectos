import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioServicio } from '../../servicios/usuario-servicio';
import { AuthServicio } from '../../servicios/auth-servicio';
import { Usuario } from '../../modelos/usuario';
import { RoleCountPipe } from '../../pipes/role-count.pipe';

@Component({
  selector: 'app-admin-usuarios',
  imports: [CommonModule, RouterLink, RoleCountPipe],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios implements OnInit{
  usuarios: Usuario[] = [];
  cargando: boolean = false;
  mostrarConfirmacion: boolean = false;
  usuarioAEliminar: number | null = null;

  constructor(private usuarioServicio: UsuarioServicio, public authServicio: AuthServicio){}

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

  cancelarEliminar (): void {
    this.mostrarConfirmacion = false;
    this.usuarioAEliminar = null;
  }
}
