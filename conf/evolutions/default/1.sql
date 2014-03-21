# --- !Ups

CREATE TABLE stuffs (
  stuff_id serial PRIMARY KEY,
  stuff_content text
);;

# --- !Downs

DROP TABLE IF EXISTS stuff;;
