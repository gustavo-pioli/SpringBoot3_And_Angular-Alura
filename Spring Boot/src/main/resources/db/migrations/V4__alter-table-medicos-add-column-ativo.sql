alter table medicos add ativo boolean;
update medicos set ativo = true where ativo is null;
alter table medicos alter column ativo set not null;