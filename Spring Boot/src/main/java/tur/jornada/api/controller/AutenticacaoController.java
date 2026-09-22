package tur.jornada.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import tur.jornada.api.domain.usuario.DadosAutenticacao;
import tur.jornada.api.domain.usuario.Usuario;
import tur.jornada.api.domain.usuario.UsuarioRepository;
import tur.jornada.api.infra.security.DadosRefreshToken;
import tur.jornada.api.infra.security.DadosTokenJWT;
import tur.jornada.api.infra.security.RefreshTokenService;
import tur.jornada.api.infra.security.TokenService;

@RestController 
@RequestMapping ("/login")
public class AutenticacaoController {

    private final TokenService tokenService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager manager;
    private final UsuarioRepository repository;
    
    public AutenticacaoController(AuthenticationManager manager, TokenService tokenService, RefreshTokenService refreshTokenService, UsuarioRepository rep){
        this.manager = manager;
        this.tokenService = tokenService;
        this.refreshTokenService = refreshTokenService;
        this.repository = rep;
    }

    @PostMapping
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);
        var usuario = (Usuario) authentication.getPrincipal();

        var tokenJWT = tokenService.gerarToken(usuario);
        var refreshToken = refreshTokenService.gerar(usuario);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<DadosTokenJWT> renovaToken(@RequestBody @Valid DadosRefreshToken dados ){

        var resultado = refreshTokenService.renovar(dados.refreshToken());
        var novoToken = tokenService.gerarToken(resultado.usuario());

        return ResponseEntity.ok(new DadosTokenJWT(novoToken, resultado.token()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody @Valid DadosRefreshToken dados){
        
        refreshTokenService.logout(dados.refreshToken());
        
        return ResponseEntity.ok().build();
    }
}