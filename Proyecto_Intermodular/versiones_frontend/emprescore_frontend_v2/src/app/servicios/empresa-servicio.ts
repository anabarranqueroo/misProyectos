import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../modelos/empresa';
import { AuthServicio } from './auth-servicio';

@Injectable({
  providedIn: 'root'
})
export class EmpresaServicio {

  private baseUrl = 'http://localhost:8080/api/empresas';

  constructor(private http: HttpClient, private authServicio: AuthServicio) {}

  /** Cabecera Authorization con Basic Auth. 
   * Obtiene email y password con la sesión en localStorage y codifica
   * a Base64 con btoa(). 
  */
  private headers(): HttpHeaders {
    const sesion = this.authServicio.obtenerSesion();
    const credenciales = btoa(`${sesion?.email}:${sesion?.['password']}`);
    return new HttpHeaders({ Authorization: `Basic ${credenciales}` });
  }

  // GET /api/empresas - Devuelve todas las empresas.
  listar(): Observable<Empresa[]> {
    const sesion = this.authServicio.obtenerSesion();
    if (sesion) {
      return this.http.get<Empresa[]>(this.baseUrl, { headers: this.headers() });
    }
    return this.http.get<Empresa[]>(this.baseUrl);
  }

  // GET /api/empresas/{id} - Devuelve una empresa por su id. 
  obtener(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }

  // GET /api/empresas/buscar?nombre=X&categoriaId=Y - Construye los parámetros de búsqueda.
  // Pasa nombre, categoriaId o ambos. 
  buscar(nombre?: string, categoriaId?: number): Observable<Empresa[]> {
    let params = '';
    if (nombre) params += `nombre=${nombre}&`;
    if (categoriaId) params += `categoriaId=${categoriaId}`;
    const sesion = this.authServicio.obtenerSesion();
    if (sesion) {
      return this.http.get<Empresa[]>(`${this.baseUrl}/buscar?${params}`, { headers: this.headers() });
    }
    return this.http.get<Empresa[]>(`${this.baseUrl}/buscar?${params}`);
  }

  // POST /api/empresas - Crea una empresa
  crear(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.baseUrl, empresa, { headers: this.headers() });
  }

  // PUT /api/empresas/{id} - Actualiza una empresa
  editar(id: number, empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.baseUrl}/${id}`, empresa, { headers: this.headers() });
  }

  // DELETE /api/empresas/{id} - Elimina una empresa
  borrar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }
}