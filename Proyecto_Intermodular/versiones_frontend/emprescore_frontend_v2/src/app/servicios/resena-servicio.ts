import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena } from '../modelos/resena';
import { AuthServicio } from './auth-servicio';

@Injectable({
  providedIn: 'root',
})
export class ResenaServicio {
  private baseUrl = 'http://localhost:8080/api/resenas';

  constructor(private http: HttpClient, private authServicio: AuthServicio) {}

  // Cabecera Basic Auth con email y password de la sesión
  private headers(): HttpHeaders {
    const sesion = this.authServicio.obtenerSesion();
    const credenciales = btoa(`${sesion?.email}:${sesion?.['password']}`);
    return new HttpHeaders({ Authorization: `Basic ${credenciales}` });
  }

  // GET /api/resenas/empresa/{empresaId} - Devuelve las reseñas aprobadas de una empresa
  listarPorEmpresa(empresaId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.baseUrl}/empresa/${empresaId}`, { headers: this.headers() });
  }

  // GET /api/resenas/empresa/{empresaId}/valoracion - Devuelve la media de estrellas de una empresa
  mediaEstrellas(empresaId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/empresa/${empresaId}/valoracion`, { headers: this.headers() });
  }

  // GET /api/resenas/pendientes - Devuele todas las reseñas pendientes de moderación
  listarPendientes(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.baseUrl}/pendientes`, { headers: this.headers() });
  }

  // POST /api/resenas - Crea una reseña en PENDIENTE
  crear(resena: Resena): Observable<Resena> {
    return this.http.post<Resena>(this.baseUrl, resena, { headers: this.headers() });
  }

  // PUT /api/resenas/{id}/aprobar - Cambia el estado de la reseña a APROBADA
  aprobar(id: number): Observable<Resena> {
    return this.http.put<Resena>(`${this.baseUrl}/${id}/aprobar`, {}, { headers: this.headers() });
  }

  // PUT /api/resenas/{id}/rechazar - Cambia el estado de la reseña a RECHAZADA
  rechazar(id: number): Observable<Resena> {
    return this.http.put<Resena>(`${this.baseUrl}/${id}/rechazar`, {}, { headers: this.headers() });
  }

  // DELETE /api/resenas/{id} - Elimina una reseña
  borrar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }
}
