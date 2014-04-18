# --- !Ups

CREATE TYPE disaster_type AS ENUM(
	'Earthquake',
	'Flood',
	'Typhoon',
	'Landslide',
	'Fire',
	'Anthropogenic'
);;

# --- !Downs

DROP TYPE IF EXISTS disaster_type;;
