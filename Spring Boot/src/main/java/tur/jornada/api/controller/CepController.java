package tur.jornada.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import tur.jornada.api.infra.cep.CepService;
import tur.jornada.api.infra.cep.DadosCep;

@RestController 
@RequestMapping ("/cep")
@SecurityRequirement (name = "bearer-key")
public class CepController {

    @Autowired 
    private CepService service;

    @GetMapping ("/{cep}")
    public ResponseEntity<DadosCep> buscar(@PathVariable String cep){
        return ResponseEntity.ok(service.buscar(cep));
    }
}
