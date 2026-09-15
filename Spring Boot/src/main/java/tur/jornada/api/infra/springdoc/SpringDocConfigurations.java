package tur.jornada.api.infra.springdoc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SpringDocConfigurations {

    @Bean
     public OpenAPI customOpenAPI() {
         return new OpenAPI()
                        .info(new Info()
                            .title("Jornada API")
                            .description("API do projeto Jornada Milhas")
                            .version("v1"))
                        .components(new Components()
                            .addSecuritySchemes("bearer-key",
                            new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
