import { Categoria } from './categoria';
import { Usuario } from './usuario';

export interface Empresa {
  id?: number;
  nombre: string;
  descripcion?: string;
  telefono?: string;
  emailContacto?: string;
  web?: string;
  categoria?: Categoria;
  usuario?: Usuario;
}