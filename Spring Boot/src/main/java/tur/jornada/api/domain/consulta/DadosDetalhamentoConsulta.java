package tur.jornada.api.domain.consulta;

import java.time.LocalDateTime;

public record DadosDetalhamentoConsulta(Long id, Long idMedico, String nomeMedico, Long idPaciente, String nomePaciente, LocalDateTime data) {

    public DadosDetalhamentoConsulta(Consulta consulta){
        this(
            consulta.getId(), 
            consulta.getMedico().getId(),
            consulta.getMedico().getNome(),
            consulta.getPaciente().getId(), 
            consulta.getPaciente().getNome(), 
            consulta.getData());
    }
}
