# --- !Ups

CREATE TABLE agencys (
	agency_id serial PRIMARY KEY,
	agency_name text NOT NULL
);;

CREATE TABLE users (
	user_id serial PRIMARY KEY,
	user_handle text NOT NULL,
	user_password text NOT NULL,
	agency_id int NOT NULL REFERENCES agencys
);;

# --- !Downs

DROP TABLE IF EXISTS users;;

DROP TABLE IF EXISTS agencies;;
