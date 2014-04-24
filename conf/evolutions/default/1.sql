# --- !Ups

CREATE EXTENSION IF NOT EXISTS pgcrypto;;

CREATE TABLE roles (
    role_id serial PRIMARY KEY,
    role_name text NOT NULL,
    role_permissions int[] NOT NULL
);;

CREATE TABLE agencys (
    agency_id serial PRIMARY KEY,
    agency_name text NOT NULL,
    agency_acronym text,
    role_id int NOT NULL REFERENCES roles
);;

CREATE TABLE municipalitys (
    municipality_id serial PRIMARY KEY REFERENCES agencys(agency_id),
    municipality_nthClass int NOT NULL
);;

CREATE TABLE users (
    user_id serial PRIMARY KEY,
    user_handle text NOT NULL,
    user_name text NOT NULL,
    user_password text NOT NULL,
    agency_id int NOT NULL REFERENCES agencys,
    user_admin boolean NOT NULL DEFAULT false
);;

# --- !Downs

DROP TABLE IF EXISTS users;;

DROP TABLE IF EXISTS municipalitys;;

DROP TABLE IF EXISTS agencys;;

DROP TABLE IF EXISTS roles;;

DROP EXTENSION IF EXISTS pgcrypto;;
