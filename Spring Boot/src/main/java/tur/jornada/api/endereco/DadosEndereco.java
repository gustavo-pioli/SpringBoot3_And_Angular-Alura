package tur.jornada.api.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DadosEndereco
 */
public record DadosEndereco(

    @NotBlank 
    String logradouro, 
    @NotBlank
    String bairro,
    @NotBlank
    @Pattern(regexp = "\\d{8}")
    String cep, 
    @NotBlank
    String cidade, 
    @NotBlank
    String uf, 
    
    String complemento, 
    String numero
) {
}
