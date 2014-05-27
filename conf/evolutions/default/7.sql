# --- !Ups

CREATE TABLE saros (
    saro_id serial PRIMARY KEY,
    saro_number text NOT NULL UNIQUE,
    saro_public boolean NOT NULL DEFAULT FALSE,
    saro_amount numeric(12,2) NOT NULL
);;

# --- !Downs

DROP TABLE IF EXISTS saros;;