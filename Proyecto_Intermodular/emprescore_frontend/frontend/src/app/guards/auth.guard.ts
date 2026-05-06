import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthServicio } from "../servicios/auth-servicio";

/**
 * CanActivateFn route guard, decide si una ruta se activa o no
 * antes de que el usuario navegue a ella.
 * Se ejecuta antes de cargar una ruta. 
 * Devuelve true -> permite acceso.
 * Devuelve false -> bloquea acceso.
 */
export const authGuard: CanActivateFn = () => {
    const authServicio = inject(AuthServicio);
    const router = inject(Router);

    if (authServicio.estaLogueado()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};