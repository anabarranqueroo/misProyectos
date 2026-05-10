import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteResena } from '../modelos/reporte-resena';
import { AuthServicio } from './auth-servicio';

@Injectable({
  providedIn: 'root',
})
export class ReporteServicio {
  private baseUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient, private authServicio: AuthServicio) {}

  // Cabecera Basic Auth
  private headers(): HttpHeaders {
    const sesion = this.authServicio.obtenerSesion();
    const credenciales = btoa(`${sesion?.email}:${sesion?.['password']}`);
    return new HttpHeaders({ Authorization: `Basic ${credenciales}` });
  }

  // GET /api/reportes - Devuelve todos los reportes
  listar(): Observable<ReporteResena[]> {
    return this.http.get<ReporteResena[]>(this.baseUrl, { headers: this.headers() });
  }

  // POST /api/reportes - Crea un nuevo reporte sobre una reseña en concreta
  crear(reporte: ReporteResena): Observable<ReporteResena> {
    return this.http.post<ReporteResena>(this.baseUrl, reporte, { headers: this.headers() });
  }

  // DELETE /api/reportes/{id} - ELimina un reporte
  borrar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }
}
