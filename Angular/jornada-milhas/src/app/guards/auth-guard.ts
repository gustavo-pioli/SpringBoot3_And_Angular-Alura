import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Autenticacao } from '../services/Autenticacao';

// Guarda funcional: forma moderna do Angular para proteger rotas, no lugar das
// antigas classes que implementavam a interface CanActivate.
// Como o login aqui é um modal aberto pela Home (não existe uma página de
// login própria), quem não está autenticado é mandado de volta pra Home, onde
// pode abrir o modal, em vez de para uma tela de "acesso negado".
export const authGuard: CanActivateFn = () => {
  const auth = inject(Autenticacao);
  const router = inject(Router);

  return auth.authenticated() || router.parseUrl('/');
};
