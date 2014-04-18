# --- !Ups

CREATE TYPE disaster_type AS ENUM(
	'Earthquake',
	'Flood',
	'Typhoon',
	'Landslide',
	'Fire',
	'Anthropogenic'
);;

CREATE TABLE disasters (
  disaster_id serial PRIMARY KEY,
  disaster_kind disaster_type NOT NULL,
  disaster_date timestamp NOT NULL,
  disaster_name text
);;

# --- !Downs

DROP TABLE IF EXISTS disasters;;

DROP TYPE IF EXISTS disaster_type;;
