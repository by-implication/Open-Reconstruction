# --- !Ups

CREATE EXTENSION ltree;;

CREATE TABLE lgus (
    lgu_id serial PRIMARY KEY REFERENCES agencys(agency_id),
    lgu_ancestors ltree NOT NULL
);;

# --- !Downs

DROP TABLE IF EXISTS lgus;;

DROP EXTENSION IF EXISTS ltree;;