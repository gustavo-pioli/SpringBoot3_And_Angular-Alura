package tur.jornada.api.infra.security;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tur.jornada.api.domain.ValidacaoException;
import tur.jornada.api.domain.usuario.RefreshToken;
import tur.jornada.api.domain.usuario.RefreshTokenRepository;
import tur.jornada.api.domain.usuario.Usuario;

@Service 
public class RefreshTokenService {
    @Autowired 
    private RefreshTokenRepository repository;


    @Value ("${api.security.refresh-token.dias-validade:7}")
    private int diasValidade;

    public String gerar(Usuario usuario){
        var token = UUID.randomUUID().toString();
        var refreshToken = new RefreshToken(null, token, usuario, LocalDateTime.now().plusDays(diasValidade));
        repository.save(refreshToken);
        return token;
    }

    public DadosDetalhamentoRefreshToken renovar(String tokenAntigo){
        var refreshToken = repository.findByToken(tokenAntigo)
            .orElseThrow(() -> new ValidacaoException("Refresh token inválido"));
        
        if(refreshToken.getExpiraEm().isBefore(LocalDateTime.now())){
            repository.delete(refreshToken);
            throw new ValidacaoException("Refresh token expirado, faça login novamente");
        }

        repository.delete(refreshToken);
        var novoToken = gerar(refreshToken.getUsuario());
        return new DadosDetalhamentoRefreshToken(refreshToken.getUsuario(), novoToken);
    }

    // deleteByUsuario é uma query derivada (não um CrudRepository.delete(entity)
    // simples como em renovar()); sem transação explícita aqui, o Hibernate
    // recusa o remove() por falta de EntityManager transacional.
    @Transactional
    public void logout(String refreshToken){
        repository.findByToken(refreshToken)
            .ifPresent(rt -> repository.deleteByUsuario(rt.getUsuario()));
    }
}
