CREATE TABLE consultas (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    medico_id BIGINT NOT NULL,
    paciente_id BIGINT NOT NULL,
    data TIMESTAMP NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_consultas_medico_id FOREIGN KEY (medico_id) REFERENCES medicos(id),
    CONSTRAINT fk_consultas_paciente_id FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);