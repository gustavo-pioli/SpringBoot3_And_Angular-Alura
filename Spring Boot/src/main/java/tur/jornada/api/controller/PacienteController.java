package tur.jornada.api.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import tur.jornada.api.domain.paciente.DadosCadastroPaciente;
import tur.jornada.api.domain.paciente.DadosListagemPaciente;
import tur.jornada.api.domain.paciente.Paciente;
import tur.jornada.api.domain.paciente.PacienteRepository;

@RestController 
@RequestMapping ("/pacientes")
public class PacienteController {

    private final PacienteRepository repository;

    public PacienteController(PacienteRepository repository){
        this.repository = repository;
    }

    @PostMapping 
    @Transactional 
    public void cadastrar(@RequestBody @Valid DadosCadastroPaciente dados) {
        repository.save(new Paciente(dados));
    }

    @GetMapping 
    public Page<DadosListagemPaciente> listar(@ParameterObject @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao){
        return repository.findAll(paginacao).map(DadosListagemPaciente::new);
    }
}
