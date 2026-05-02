import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Home } from './componentes/home/home';
import { Register } from './componentes/register/register';
import { Profile } from './componentes/profile/profile';

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
        path: 'perfil',
        component: Profile
    }
];
