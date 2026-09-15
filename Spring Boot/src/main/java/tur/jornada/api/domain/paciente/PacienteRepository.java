package tur.jornada.api.domain.paciente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    @Query("""
            select m.ativo from Paciente m
            where m.id = :idPaciente
            """)
    Boolean findAtivoById(Long idPaciente);
}
