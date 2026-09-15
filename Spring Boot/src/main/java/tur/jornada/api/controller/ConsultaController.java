package tur.jornada.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import tur.jornada.api.domain.consulta.AgendaDeConsultas;
import tur.jornada.api.domain.consulta.DadosAgendamentoConsulta;
import tur.jornada.api.domain.consulta.DadosCancelamentoConsulta;
import tur.jornada.api.domain.consulta.DadosDetalhamentoConsulta;

@RestController 
@RequestMapping ("consultas")
@SecurityRequirement(name = "bearer-key")
public class ConsultaController {

    @Autowired 
    private AgendaDeConsultas agenda;

    @PostMapping 
    @Transactional 
    public ResponseEntity<DadosDetalhamentoConsulta> agendar(@RequestBody @Valid DadosAgendamentoConsulta dados) {
        
        var dto = agenda.agendar(dados);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> cancelar(@RequestBody @Valid DadosCancelamentoConsulta dados) {
        agenda.cancelar(dados);
        return ResponseEntity.noContent().build();
    }

}