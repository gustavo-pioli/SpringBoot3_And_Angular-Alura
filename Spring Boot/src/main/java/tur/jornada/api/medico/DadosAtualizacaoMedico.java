package tur.jornada.api.medico;

import jakarta.validation.constraints.NotNull;
import tur.jornada.api.endereco.DadosEndereco;

public record DadosAtualizacaoMedico(

    @NotNull
    Long id,
    String nome, 
    String telefone, 
    DadosEndereco endereco) {
}
