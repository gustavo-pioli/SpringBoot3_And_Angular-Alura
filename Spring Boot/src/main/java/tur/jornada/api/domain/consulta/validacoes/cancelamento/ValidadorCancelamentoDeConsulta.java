package tur.jornada.api.domain.consulta.validacoes.cancelamento;

import tur.jornada.api.domain.consulta.DadosCancelamentoConsulta;

public interface ValidadorCancelamentoDeConsulta {

    public void validar(DadosCancelamentoConsulta dados);
}
