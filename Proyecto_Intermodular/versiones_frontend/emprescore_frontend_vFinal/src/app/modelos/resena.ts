import { Empresa } from './empresa';
import { Usuario } from './usuario';

export interface Resena {
  id?: number;
  titulo: string;
  contenido: string;
  estrella: number;
  respuesta?: string;
  estado?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  empresa?: Empresa;
  usuario?: Usuario;
}