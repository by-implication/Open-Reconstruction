# --- !Ups

ALTER TABLE reqs
	ADD COLUMN requirement_ids int[] NOT NULL DEFAULT '{}';

ALTER TABLE requirements
	ADD COLUMN requirement_deprecated boolean NOT NULL DEFAULT false;

UPDATE reqs req SET requirement_ids = (
	SELECT array_agg(requirement_id)
	FROM requirements, gov_units g NATURAL JOIN roles
		WHERE req.gov_unit_id = g.gov_unit_id
		AND requirement_target = (CASE
		  WHEN role_name = 'LGU' THEN 'LGU'
		  ELSE 'NGA'
		END)
	);

# --- !Downs

ALTER TABLE requirements
	DROP COLUMN requirement_deprecated;

ALTER TABLE reqs
	DROP COLUMN requirement_ids;
