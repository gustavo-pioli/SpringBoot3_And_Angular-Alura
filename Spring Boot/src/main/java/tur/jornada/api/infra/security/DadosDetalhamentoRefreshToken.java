package tur.jornada.api.infra.security;

import tur.jornada.api.domain.usuario.Usuario;

public record DadosDetalhamentoRefreshToken(Usuario usuario, String token) {
    
}
