package tur.jornada.api.domain.medico;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import tur.jornada.api.domain.endereco.DadosEndereco;

/**
 * DadosCadastroMedico
 */
public record DadosCadastroMedico(
    @NotBlank(message = "{nome.obrigatorio}") //uso de constante em ValidationMessages.properties
    String nome,
    @NotBlank 
    String telefone,
    @NotBlank
    @Email  
    String email,
    @NotBlank(message = "CRM é obrigatório") //Exemplo de mensagem personalizada 
    @Pattern(regexp = "\\d{4,6}")
    String crm,
    @NotNull  
    Especialidade especialidade, 
    @NotNull
    @Valid 
    DadosEndereco endereco
) {

}
