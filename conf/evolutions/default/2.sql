# --- !Ups

CREATE EXTENSION IF NOT EXISTS pgcrypto;;

CREATE TABLE roles (
    role_id serial PRIMARY KEY,
    role_name text NOT NULL,
    role_permissions int[] NOT NULL
);;

INSERT INTO roles VALUES
	(DEFAULT, 'LGU', '{1}'),
	(DEFAULT, 'OCD', '{2, 3, 5}'),
    (DEFAULT, 'OP', '{5}'),
	(DEFAULT, 'DPWH', '{1, 3, 2, 4, 5}'),
	(DEFAULT, 'DBM', '{1, 6, 5}'),
    (DEFAULT, 'NGA', '{1, 4}');;

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

DROP EXTENSION IF EXISTS pgcrypto;;
