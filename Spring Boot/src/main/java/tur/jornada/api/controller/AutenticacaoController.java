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
import tur.jornada.api.infra.security.DadosTokenJWT;
import tur.jornada.api.infra.security.TokenService;

@RestController 
@RequestMapping ("/login")
public class AutenticacaoController {

    private final TokenService tokenService;
    private final AuthenticationManager manager;
    
    public AutenticacaoController(AuthenticationManager manager, TokenService tokenService){
        this.manager = manager;
        this.tokenService = tokenService;
    }

    @PostMapping
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }
}