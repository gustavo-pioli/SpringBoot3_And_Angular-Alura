package tur.jornada.api.domain.consulta.validacoes.agendamento;

import org.springframework.stereotype.Component;

import tur.jornada.api.domain.ValidacaoException;
import tur.jornada.api.domain.consulta.DadosAgendamentoConsulta;
import tur.jornada.api.domain.paciente.PacienteRepository;

@Component 
public class ValidadorPacienteAtivo implements ValidadorAgendamentoDeConsulta{

    private PacienteRepository repository;

    public void validar(DadosAgendamentoConsulta dados){
        var pacienteEstaAtivo = repository.findAtivoById(dados.idMedico());
        if(!pacienteEstaAtivo){
            throw new ValidacaoException("Consulta não pode ser agendada com paciente excluído!");
        }
    }
}
