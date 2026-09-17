import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Gerenciamento } from './pages/gerenciamento/gerenciamento';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        // canActivate roda o guard antes de ativar a rota: sem login, nunca
        // chega a instanciar o componente Gerenciamento nem chamar a API.
        path: 'gerenciamento',
        component: Gerenciamento,
        canActivate: [authGuard]
    }
];
