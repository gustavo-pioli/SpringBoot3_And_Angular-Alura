package tur.jornada.api.domain.medico;

import jakarta.validation.constraints.NotNull;
import tur.jornada.api.domain.endereco.DadosEndereco;

public record DadosAtualizacaoMedico(

    @NotNull
    Long id,
    String nome, 
    String telefone, 
    DadosEndereco endereco) {
}
