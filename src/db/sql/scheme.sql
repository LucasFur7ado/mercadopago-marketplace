-- drop table if not exists mercadopago_marketplace;
-- create database mercadopago_marketplace;

create table users (
  id serial not null,
  email varchar(100) not null unique,
  password varchar(200) not null,
  is_verified boolean not null default false,
  email_verification_code varchar(10) null,
  created_at timestamp default current_timestamp,
  primary key(id)
);

create table authorizations (
  id serial not null,
  user_id serial not null,
  state varchar(100),
  refresh_token varchar(100) default null,
  access_token varchar(100) default null,
  created_at timestamp default current_timestamp,
  foreign key(user_id) references users(id),
  primary key(user_id)
);

create table products (
  id serial not null,
  name varchar(50) not null,
  price float not null,
  description varchar(200) default null,
  seller_id serial not null,
  created_at timestamp default current_timestamp,
  foreign key(seller_id) references users(id)
);