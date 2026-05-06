import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../modelos/categoria';
import { AuthServicio } from './auth-servicio';

@Injectable({
  providedIn: 'root',
})
export class CategoriaServicio {
  private baseUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient, private authServicio: AuthServicio) {}

  // Cabecera Basic Auth
  private headers(): HttpHeaders {
    const sesion = this.authServicio.obtenerSesion();
    const credenciales = btoa(`${sesion?.email}:${sesion?.['password']}`);
    return new HttpHeaders({ Authorization: `Basic ${credenciales}` });
  }

  // GET /api/categorias - Devuelve todas las categorías
  listar(): Observable<Categoria[]> {
    const sesion = this.authServicio.obtenerSesion();
    if (sesion) {
      return this.http.get<Categoria[]>(this.baseUrl, { headers: this.headers() });
    }
    return this.http.get<Categoria[]>(this.baseUrl);
  }
}
