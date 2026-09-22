package tur.jornada.api.domain.usuario;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity (name = "RefreshToken")
@Table (name = "refresh_tokens")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class RefreshToken {

    @Id @GeneratedValue (strategy = GenerationType.IDENTITY) 
    private Long id;
    private String token;
    
    @ManyToOne 
    private Usuario usuario;
    private LocalDateTime expiraEm;

}
