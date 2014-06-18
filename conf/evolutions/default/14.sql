# --- !Ups

CREATE TABLE brgy_coords(
  psgc ltree NOT NULL UNIQUE,
  lat decimal NOT NULL,
  lng decimal NOT NULL
);;

COPY brgy_coords FROM 'brgy_coords.csv' CSV;;

ALTER TABLE lgus
	ADD COLUMN lgu_lat decimal,
	ADD COLUMN lgu_lng decimal;;

UPDATE lgus
	SET lgu_lat = lat, lgu_lng = lng
	FROM brgy_coords
	WHERE lgu_psgc = psgc;;

# --- !Downs

ALTER TABLE lgus
	DROP COLUMN lgu_lat,
	DROP COLUMN lgu_lng;;

DROP TABLE IF EXISTS brgy_coords;;