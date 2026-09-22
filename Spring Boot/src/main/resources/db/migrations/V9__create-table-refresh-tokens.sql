create table refresh_tokens(
    id bigint generated always as identity,
    token varchar(255) not null unique,
    usuario_id bigint not null,
    expira_em timestamp not null,

    primary key (id),
    constraint fk_refresh_tokens_usuario_id foreign key (usuario_id) references usuarios(id)
);