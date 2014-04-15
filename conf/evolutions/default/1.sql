# --- !Ups

CREATE TYPE disaster_type AS ENUM(
	'Earthquake',
	'Flood',
	'Typhoon',
	'Landslide',
	'Anthropogenic'
);;

CREATE TABLE disasters (
  disaster_id serial PRIMARY KEY,
  disaster_kind disaster_type NOT NULL,
  disaster_name text NOT NULL,
  disaster_date timestamp NOT NULL,
  disaster_cause text
);;

# --- !Downs

DROP TABLE IF EXISTS disasters;;

DROP TYPE IF EXISTS disaster_type;;
