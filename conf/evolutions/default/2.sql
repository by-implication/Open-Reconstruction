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
	(DEFAULT, 'LGU', '{"CREATE_REQUESTS"}'),
	(DEFAULT, 'OCD', '{"VALIDATE_REQUESTS", "EDIT_REQUESTS", "SIGNOFF"}'),
    (DEFAULT, 'OP', '{"SIGNOFF"}'),
	(DEFAULT, 'DPWH', '{"CREATE_REQUESTS", "EDIT_REQUESTS", "VALIDATE_REQUESTS", "IMPLEMENT_REQUESTS", "SIGNOFF"}'),
	(DEFAULT, 'DBM', '{"CREATE_REQUESTS", "ASSIGN_FUNDING", "SIGNOFF"}'),
    (DEFAULT, 'NGA', '{"CREATE_REQUESTS", "IMPLEMENT_REQUESTS"}');;

CREATE TABLE agencys (
	agency_id serial PRIMARY KEY,
	agency_name text NOT NULL,
    agency_acronym text,
	role_id int NOT NULL REFERENCES roles
);;

INSERT INTO agencys VALUES
    (DEFAULT, 'Barangay San Miguel', null, 1),
    (DEFAULT, 'Office of Civil Defense', 'OCD', 2),
    (DEFAULT, 'Office of the President', 'OP', 3),
    (DEFAULT, 'Department of Public Works and Highways', 'DPWH', 4),
    (DEFAULT, 'Department of Budget and Management', 'DBM', 5);;

CREATE TABLE users (
	user_id serial PRIMARY KEY,
	user_handle text NOT NULL,
    user_name text,
	user_password text NOT NULL,
	agency_id int NOT NULL REFERENCES agencys,
	user_admin boolean NOT NULL DEFAULT false
);;

INSERT INTO users VALUES
    (DEFAULT, 'brgyoza', 'Brenda Repolyo Gyoza', crypt('password', gen_salt('bf')), 1, true),
    (DEFAULT, 'ocdeguzman', 'Oscar Clamidio De Guzman', crypt('password', gen_salt('bf')), 2, true),
    (DEFAULT, 'bsaquinoiii', 'Benigno S. Aquino III', crypt('password', gen_salt('bf')), 3, true),
    (DEFAULT, 'dpwhereford', 'David Pena Whereford', crypt('password', gen_salt('bf')), 4, true),
    (DEFAULT, 'dbmoya', 'Dersecretary Bon Moya', crypt('password', gen_salt('bf')), 5, true);;

# --- !Downs

DROP TABLE IF EXISTS users;;

DROP TABLE IF EXISTS agencys;;

DROP TABLE IF EXISTS roles;;

DROP TYPE IF EXISTS permission;;

DROP EXTENSION IF EXISTS pgcrypto;;