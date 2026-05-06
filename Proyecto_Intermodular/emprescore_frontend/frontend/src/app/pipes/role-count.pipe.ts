import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../modelos/usuario';

@Pipe({
  name: 'roleCount',
  standalone: true
})

/**
 * La interfaz PipeTransform obliga a definir el método con transform.
 * Filtra los usuarios de ese rol y devuelve cuántos hay.
 */
export class RoleCountPipe implements PipeTransform {
  transform(usuarios: Usuario[], rol: string): number {
    const usuariosFiltrados = usuarios.filter(usuario => {
    return usuario.rol === rol;
    });
        return usuariosFiltrados.length;
    }
}