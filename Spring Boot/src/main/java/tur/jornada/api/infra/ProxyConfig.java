package tur.jornada.api.infra;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import jakarta.annotation.PostConstruct;

@Component
public class ProxyConfig {

    @Value("${proxy.host:}") private String host;
    @Value("${proxy.port:}") private String port;
    @Value("${proxy.usuario:}") private String usuario;
    @Value("${proxy.senha:}") private String senha;

    @PostConstruct
    void configurar() {
        if (host.isBlank()) {
            return; // ninguém configurou proxy local: não mexe em nada
        }

        System.setProperty("https.proxyHost", host);
        System.setProperty("https.proxyPort", port);
        System.setProperty("https.proxyUser", usuario);
        System.setProperty("https.proxyPassword", senha);
        System.setProperty("jdk.http.auth.tunneling.disabledSchemes", "");
    }
}

