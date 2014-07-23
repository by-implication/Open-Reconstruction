# --- !Ups

ALTER TABLE reqs
	ADD COLUMN requirement_ids int[] NOT NULL DEFAULT '{}';

ALTER TABLE requirements
	ADD COLUMN requirement_deprecated boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION requirement_ids() RETURNS int[] AS $$
	BEGIN
		RETURN ARRAY(SELECT requirement_id FROM requirements WHERE NOT requirement_deprecated);;
	END;;
$$ LANGUAGE plpgsql;

UPDATE reqs SET requirement_ids = requirement_ids();

# --- !Downs

DROP FUNCTION IF EXISTS requirement_ids();

ALTER TABLE requirements
	DROP COLUMN requirement_deprecated;

ALTER TABLE reqs
	DROP COLUMN requirement_ids;
