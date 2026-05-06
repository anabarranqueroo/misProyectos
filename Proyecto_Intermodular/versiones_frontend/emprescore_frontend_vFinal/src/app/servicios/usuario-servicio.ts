import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { AuthServicio } from './auth-servicio';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient, private authServicio: AuthServicio) { }

  // Cabecera Basic Auth con email y password de la sesión
  private headers(): HttpHeaders {
    const sesion = this.authServicio.obtenerSesion();
    const credenciales = btoa(`${sesion?.email}:${sesion?.['password']}`);
    return new HttpHeaders({ Authorization: `Basic ${credenciales}` });
  }

  // GET /api/usuarios - Devuelve la lista de todos los usuarios
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, { headers: this.headers() });
  }

  // PUT /api/usuarios/{id}/cambiar-password - Cambia la contraseña del usuario verificando la contraseña actual
  cambiarPassword(id: number, passwordActual: string, passwordNueva: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${id}/cambiar-password`,
      { passwordActual, passwordNueva },
      { headers: this.headers() }
    );
  }

  // PUT /api/usuarios/reset-password - Resetea la contraseña de un usuario dado su email (sin autenticación)
  resetPassword(email: string, passwordNueva: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/reset-password`, { email, passwordNueva });
  }

  // PUT /api/usuarios/{id}/perfil - Edita el nombre y el email del usuario
  editarPerfil(id: number, nombre: string, email: string): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.baseUrl}/${id}/perfil`,
      { nombre, email },
      { headers: this.headers() }
    );
  }

  // PUT /api/usuarios/{id} - Actualiza los datos completos de un usuario
  editar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario, { headers: this.headers() });
  }

  // DELETE /api/usuarios/{id} - Elimina un usuario
  borrar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }
}
