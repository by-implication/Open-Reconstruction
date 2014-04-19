# --- !Ups

CREATE TYPE disaster_type AS ENUM(
	'Typhoon',
    'Earthquake',
    'Flood',
	'Landslide',
	'Fire',
	'Anthropogenic'
);;

# --- !Downs

DROP TYPE IF EXISTS disaster_type;;
