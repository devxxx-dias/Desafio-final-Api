--Sprint I--
create database pdv;

create table usuarios(
id  serial primary key,
nome varchar(255) not null,
email varchar(255) unique not null,
senha varchar(255) not null);

create table categorias(
id  serial primary key,
descricao varchar(255) not null);
  
insert into categorias (descricao)
values
  ('Informática'),
  ('Celulares'),
  ('Beleza e Perfumaria'),
  ('Mercado'),
  ('Brinquedos'),
  ('Moda'),
  ('Bebê'),
  ('Games');


  --Sprint II--

create table produtos(
id serial primary key,
descricao text not null,
quantidade_estoque integer not null,
valor integer not null,
categoria_id integer not null references categorias (id)
);

create table clientes (
id serial primary key,
nome varchar(255) not null,
email varchar(255) not null unique,
cpf varchar(14) not null unique,
cep varchar(18),
rua text,
numero integer,
bairro varchar(255),
cidade varchar(255),
estado varchar(255) 
);


--Sprint III--
create table pedidos (
  id serial primary key,
  cliente_id integer references clientes(id) not null,
  observacao text,
  valor_total integer not null
  );
  
  create table pedido_produtos (
    id serial primary key,
    pedido_id integer references pedidos (id) not null,
    produto_id integer references produtos(id) not null,
    quantidade_produto integer not null,
    valor_produto integer not null
    );
    
   
   
alter table produtos
add column produto_imagem text;
    

