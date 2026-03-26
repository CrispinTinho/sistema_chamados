CREATE TABLE usuario (
  id serial primary key,
  nome varchar(255),
  email varchar(255) not null unique,
  senha varchar(255),
  criado_em timestamp default current_timestamp
);

CREATE TABLE chamado (
  id serial primary key,
  titulo varchar(255) not null,
  descricao text,
  status varchar(50) default 'aberto',
  criado_em timestamp default current_timestamp,
  responsavel_id integer not null references usuario(id) on delete cascade
);