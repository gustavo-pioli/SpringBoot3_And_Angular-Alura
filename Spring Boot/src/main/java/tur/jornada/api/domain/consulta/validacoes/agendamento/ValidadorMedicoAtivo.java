package tur.jornada.api.domain.consulta.validacoes.agendamento;

import org.springframework.stereotype.Component;

import tur.jornada.api.domain.ValidacaoException;
import tur.jornada.api.domain.consulta.DadosAgendamentoConsulta;
import tur.jornada.api.domain.medico.MedicoRepository;

@Component 
public class ValidadorMedicoAtivo implements ValidadorAgendamentoDeConsulta{

    private MedicoRepository repository;

    public void validar(DadosAgendamentoConsulta dados){
        if(dados.idMedico() == null){
            return;
        }

        var medicoEstaAtivo = repository.findAtivoById(dados.idMedico());
        if(!medicoEstaAtivo){
            throw new ValidacaoException("Consulta não pode ser agendada com médico inativo!");
        }
    }
}
