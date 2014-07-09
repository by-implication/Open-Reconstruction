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

-- CREATE OR REPLACE FUNCTION get_gov_unit_name(id int, OUT name text) AS $$
-- BEGIN
--   RETURN SELECT gov_unit_name FROM gov_units WHERE gov_unit_id = $1;
-- END;
-- $$ LANGUAGE plpgsql IMMUTABLE;

-- select (string_to_array(ltree2text(lgu_psgc), '.')::int[]) from lgus;