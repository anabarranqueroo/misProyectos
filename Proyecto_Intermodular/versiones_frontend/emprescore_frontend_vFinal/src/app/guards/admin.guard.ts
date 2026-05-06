import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthServicio } from "../servicios/auth-servicio";

export const adminGuard: CanActivateFn = () => {
    const authServicio = inject(AuthServicio);
    const router = inject(Router);

    if (authServicio.esAdmin()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};