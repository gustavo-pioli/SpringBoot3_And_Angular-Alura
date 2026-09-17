package tur.jornada.api.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import tur.jornada.api.domain.consulta.AgendaDeConsultas;
import tur.jornada.api.domain.consulta.DadosAgendamentoConsulta;
import tur.jornada.api.domain.consulta.DadosCancelamentoConsulta;
import tur.jornada.api.domain.consulta.DadosDetalhamentoConsulta;
import tur.jornada.api.domain.medico.DadosListagemMedico;

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

    @GetMapping 
    public ResponseEntity<Page<DadosDetalhamentoConsulta>> listar(
        @ParameterObject @PageableDefault(size = 10, sort={"data"})
        Pageable paginacao
    ){
        Page<DadosDetalhamentoConsulta> page = agenda.listar(paginacao);
        return ResponseEntity.ok(page);
    }
}