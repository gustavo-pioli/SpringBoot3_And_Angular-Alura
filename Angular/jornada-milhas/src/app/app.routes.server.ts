import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Essa página só faz sentido no navegador: depende do token salvo no
    // localStorage e sempre busca dados atuais da API. Prerenderizar no build
    // (ou tentar rodar no servidor) não teria como autenticar nem faria
    // sentido, já que o conteúdo é sempre dinâmico por usuário.
    path: 'gerenciamento',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
