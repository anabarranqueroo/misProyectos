import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../modelos/login-request';
import { LoginResponse } from '../modelos/login-response';
import { Usuario } from '../modelos/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServicio {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  //POST /api/auth/login con email y contraseña. Devuelve un LoginResponse con id, nombre, email y rol.
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credenciales);
  }

  //POST /api/auth/register crea un usuario con rol USER.
  register(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/register`, usuario);
  }

  //POST /api/auth/register-empresa crea un usuario con rol EMPRESA.
  registerEmpresa(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/register-empresa`, usuario);
  }

  //Guarda el LoginResponse en el LocalStorage del navegador como texto JSON.
  guardarSesion(usuario: LoginResponse): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  //Lee localStorage y devuelve el objeto del usuario logueado o null.
  obtenerSesion(): LoginResponse | null {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  }

  //Elimina los datos del localStorage.
  cerrarSesion(): void {
    localStorage.removeItem('usuario');
  }

  //Devuelve true si hay datos en localStorage.
  estaLogueado(): boolean {
    return this.obtenerSesion() !== null;
  }

  //Devuelve true si el rol del usuario logueado es ADMIN.
  esAdmin(): boolean {
    return this.obtenerSesion()?.rol === 'ADMIN';
  }

  //Devuelve true si el rol del usuario logueado es EMPRESA.
  esEmpresa(): boolean {
    return this.obtenerSesion()?.rol === 'EMPRESA';
  }

  //Cabecera de autenticación Basic Auth
  getCredencialesBasic(): string {
    const sesion = this.obtenerSesion();
    if (!sesion) return '';
    const credencial = `${sesion.email}:${sesion['password']}`;
    return 'Basic ' + btoa(credencial);
  }
}