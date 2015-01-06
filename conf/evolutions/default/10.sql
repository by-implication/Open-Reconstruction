# --- !Ups

CREATE TABLE lgu_coords(
  psgc ltree NOT NULL UNIQUE,
  lat decimal NOT NULL,
  lng decimal NOT NULL
);;

COPY lgu_coords FROM 'lgu_coords.csv' CSV;;

ALTER TABLE lgus
	ADD COLUMN lgu_lat decimal,
	ADD COLUMN lgu_lng decimal;;

UPDATE lgus
	SET lgu_lat = lat, lgu_lng = lng
	FROM lgu_coords
	WHERE lgu_psgc = psgc;;

# --- !Downs

ALTER TABLE lgus
	DROP COLUMN lgu_lat,
	DROP COLUMN lgu_lng;;

DROP TABLE IF EXISTS lgu_coords;;