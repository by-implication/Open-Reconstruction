# --- !Ups

ALTER TABLE gov_units
	ADD COLUMN gov_unit_search_key text;

UPDATE gov_units
	SET gov_unit_search_key = gov_unit_name;

ALTER TABLE gov_units
	ALTER COLUMN gov_unit_search_key SET NOT NULL;

# --- !Downs

ALTER TABLE gov_units
	DROP COLUMN gov_unit_search_key;
