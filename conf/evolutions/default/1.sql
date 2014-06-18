# --- !Ups

CREATE EXTENSION IF NOT EXISTS pgcrypto;;

CREATE EXTENSION IF NOT EXISTS ltree;;

CREATE TABLE roles (
    role_id serial PRIMARY KEY,
    role_name text NOT NULL,
    role_permissions int[] NOT NULL
);;

CREATE TABLE gov_units (
    gov_unit_id serial PRIMARY KEY,
    gov_unit_name text NOT NULL,
    gov_unit_acronym text,
    role_id int NOT NULL REFERENCES roles
);;

CREATE TABLE lgus (
    lgu_id serial PRIMARY KEY REFERENCES gov_units(gov_unit_id),
    lgu_municipality_class int,
    lgu_psgc ltree NOT NULL
);;

CREATE TABLE users (
    user_id serial PRIMARY KEY,
    user_handle text NOT NULL UNIQUE,
    user_name text NOT NULL,
    user_password text NOT NULL,
    gov_unit_id int NOT NULL REFERENCES gov_units,
    user_admin boolean NOT NULL DEFAULT false
);;

# --- !Downs

DROP TABLE IF EXISTS users;;

DROP TABLE IF EXISTS lgus;;

DROP TABLE IF EXISTS gov_units;;

DROP TABLE IF EXISTS roles;;

DROP EXTENSION IF EXISTS ltree;;

DROP EXTENSION IF EXISTS pgcrypto;;
