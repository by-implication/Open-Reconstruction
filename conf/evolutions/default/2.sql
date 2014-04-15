# --- !Ups

CREATE EXTENSION IF NOT EXISTS pgcrypto;;

CREATE TYPE user_type AS ENUM(
	'LGU',
	'GOCC',
	'NGA',
	'OCD',
	'ASSESSING_AGENCY', /* like DPWH */
	'OP',
	'DBM'
);;

CREATE TABLE users (
	user_id serial PRIMARY KEY,
	user_handle text NOT NULL,
	user_password text NOT NULL,
	user_kind user_type NOT NULL
);;

# --- !Downs

DROP TABLE IF EXISTS users;;

DROP TYPE IF EXISTS user_type;;

DROP EXTENSION IF EXISTS pgcrypto;;