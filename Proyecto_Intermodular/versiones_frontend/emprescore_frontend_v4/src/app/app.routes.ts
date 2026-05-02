import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Home } from './componentes/home/home';
import { Register } from './componentes/register/register';
import { Profile } from './componentes/profile/profile';
import { EmpresaDetails } from './componentes/empresa-details/empresa-details';
import { FormEmpresa } from './componentes/form-empresa/form-empresa';
import { Admin } from './componentes/admin/admin';
import { AdminUsuarios } from './componentes/admin-usuarios/admin-usuarios';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'register/:tipo',
        component: Register
    },
    {
        path: 'perfil',
        component: Profile,
        canActivate: [authGuard]
    },
    {
        path: 'empresa/:id',
        component: EmpresaDetails
    },
    {
        path: 'form-empresa/:id',
        component: FormEmpresa,
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'admin/usuarios',
        component: AdminUsuarios,
        canActivate: [authGuard, adminGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
