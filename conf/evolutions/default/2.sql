# --- !Ups

CREATE EXTENSION IF NOT EXISTS pgcrypto;;

CREATE TYPE permission AS ENUM(
    'CREATE_REQUESTS',
    'VALIDATE_REQUESTS',
    'EDIT_REQUESTS',
    'IMPLEMENT_REQUESTS',
    'SIGNOFF',
    'ASSIGN_FUNDING'
);;

CREATE TABLE roles (
    role_id serial PRIMARY KEY,
    role_name text NOT NULL,
    role_permissions permission[] NOT NULL
);;

INSERT INTO roles VALUES
	(DEFAULT, 'request creator', '{"CREATE_REQUESTS"}'),
	(DEFAULT, 'administrator', '{"VALIDATE_REQUESTS", "EDIT_REQUESTS", "SIGNOFF"}'),
	(DEFAULT, 'validator', '{"VALIDATE_REQUESTS", "SIGNOFF"}'),
	(DEFAULT, 'implementor', '{"IMPLEMENT_REQUESTS"}'),
	(DEFAULT, 'approver', '{"SIGNOFF"}'),
	(DEFAULT, 'creator, validator, implementor', '{"CREATE_REQUESTS", "VALIDATE_REQUESTS", "IMPLEMENT_REQUESTS", "SIGNOFF"}'),
	(DEFAULT, 'fund assigner', '{"ASSIGN_FUNDING", "SIGNOFF"}');;

CREATE TABLE agencys (
	agency_id serial PRIMARY KEY,
	agency_name text NOT NULL,
	role_id int NOT NULL REFERENCES roles
);;

INSERT INTO agencys VALUES
	(DEFAULT, 'LGU', 1),
	(DEFAULT, 'NGA', 1),
	(DEFAULT, 'GOCC', 1),
	(DEFAULT, 'OCD', 2),
	(DEFAULT, 'OP', 5),
	(DEFAULT, 'DPWH', 6),
	(DEFAULT, 'DBM', 7);;

CREATE TABLE users (
	user_id serial PRIMARY KEY,
	user_handle text NOT NULL,
	user_password text NOT NULL,
	agency_id int NOT NULL REFERENCES agencys,
	user_admin boolean NOT NULL DEFAULT false
);;

INSERT INTO users VALUES
	(DEFAULT, 'OCD', crypt('password', gen_salt('bf')), 4, true),
	(DEFAULT, 'LGU', crypt('password', gen_salt('bf')), 1, true);;

# --- !Downs

DROP TABLE IF EXISTS users;;

DROP TABLE IF EXISTS agencys;;

DROP TABLE IF EXISTS roles;;

DROP TYPE IF EXISTS permission;;

DROP EXTENSION IF EXISTS pgcrypto;;