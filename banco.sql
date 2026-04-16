CREATE TABLE usuarios (
  id serial primary key,
  nome varchar(255) not null,
  email varchar(255) unique not null,
  senha varchar(255) not null,
  criado_em timestamp default current_timestamp
);

CREATE TABLE chamados (
  id serial primary key,
  titulo varchar(255) not null,
  descricao varchar(1000) not null,
  status_chamado varchar(255) default 'aberto',
  responsavel_id int not null,
  criado_em timestamp default current_timestamp,

  constraint fk_responsavel
  foreign key (responsavel_id)
  references usuarios(id)
  on delete cascade
);