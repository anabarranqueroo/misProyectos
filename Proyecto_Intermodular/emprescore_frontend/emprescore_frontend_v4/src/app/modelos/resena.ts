import { Empresa } from './empresa';
import { Usuario } from './usuario';

export interface Resena {
  id?: number;
  titulo: string;
  contenido: string;
  estrella: number;
  estado?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  empresa?: Empresa;
  usuario?: Usuario;
}