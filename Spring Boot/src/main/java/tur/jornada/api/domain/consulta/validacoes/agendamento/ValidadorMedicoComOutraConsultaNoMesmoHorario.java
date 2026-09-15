package tur.jornada.api.domain.consulta.validacoes.agendamento;

import org.springframework.stereotype.Component;

import tur.jornada.api.domain.ValidacaoException;
import tur.jornada.api.domain.consulta.ConsultaRepository;
import tur.jornada.api.domain.consulta.DadosAgendamentoConsulta;

@Component 
public class ValidadorMedicoComOutraConsultaNoMesmoHorario implements ValidadorAgendamentoDeConsulta {

    private ConsultaRepository repository;

    public void validar(DadosAgendamentoConsulta dados){
        var medicoPossuiOutraConsultaNoMesmoHorario = repository.existsByMedicoIdAndDataAndMotivoCancelamentoIsNull(dados.idMedico(), dados.data());
        if(medicoPossuiOutraConsultaNoMesmoHorario){
            throw new ValidacaoException("Médico possui outra consulta agendada no mesmo horário");
        }
    }
}
