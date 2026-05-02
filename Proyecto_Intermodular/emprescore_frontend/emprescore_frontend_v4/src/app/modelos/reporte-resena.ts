import { Resena } from './resena';
import { Usuario } from './usuario';

export interface ReporteResena {
  id?: number;
  motivo: string;
  estado?: string;
  fecha_creacion?: string;
  resena?: Resena;
  usuario?: Usuario;
}