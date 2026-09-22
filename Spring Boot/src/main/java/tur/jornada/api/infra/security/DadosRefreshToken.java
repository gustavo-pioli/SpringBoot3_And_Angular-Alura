package tur.jornada.api.infra.security;
import jakarta.validation.constraints.NotBlank;


public record DadosRefreshToken(
    
    @NotBlank
    String refreshToken
) {
}
