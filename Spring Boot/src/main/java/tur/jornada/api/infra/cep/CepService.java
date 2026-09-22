package tur.jornada.api.infra.cep;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.net.http.HttpClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import tur.jornada.api.domain.ValidacaoException;

@Service 
public class CepService {

    // @Value ("${proxy.usuario}")
    // private String proxyUsuario;
    // @Value("${proxy.senha}")
    // private String proxySenha;


    private RestClient criarRestClient() {
        // var httpClient = HttpClient.newBuilder()
        //     .authenticator(new Authenticator() {
        //         @Override 
        //         protected PasswordAuthentication getPasswordAuthentication(){
        //             return new PasswordAuthentication(proxyUsuario, proxySenha.toCharArray());
        //         }
        //     }).build();
        return RestClient.builder()
            .baseUrl("https://viacep.com.br/ws")
            .requestFactory(new SimpleClientHttpRequestFactory())
            // .requestFactory(new JdkClientHttpRequestFactory(httpClient))
            .build();
    } 

    private final RestClient restClient = criarRestClient(); 

    public DadosCep buscar(String cep) {
        var res = restClient.get()
            .uri("/{cep}/json/", cep)
            .retrieve()
            .body(DadosCep.class);
        
        if( res == null || res.erro()){
            throw new ValidacaoException("Cep não encontrado");
        }

        return res;
    }
}
