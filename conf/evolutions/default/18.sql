# --- !Ups

ALTER TABLE reqs
	ADD COLUMN gov_unit_id int REFERENCES gov_units,
	ADD COLUMN req_legacy boolean NOT NULL DEFAULT FALSE,
	ADD COLUMN executing_agency_id int REFERENCES gov_units(gov_unit_id);

UPDATE reqs
	SET gov_unit_id = users.gov_unit_id
	FROM users WHERE author_id = user_id;

ALTER TABLE reqs
	ALTER COLUMN gov_unit_id SET NOT NULL;

UPDATE roles
	SET role_permissions = array_append(role_permissions, 7)
	WHERE role_name = ANY(ARRAY['NGA', 'OCD']);

UPDATE reqs
	SET gov_unit_id = lgu_id
	FROM lgus
	WHERE req_location = ltree2text(lgu_psgc);

UPDATE reqs
	SET req_legacy = true
	WHERE author_id = 1;

UPDATE users
	SET gov_unit_id = 2 -- OCD
	WHERE user_id = 1; -- Legacy Data

UPDATE reqs
	SET gov_unit_id = 2 -- OCD
	WHERE gov_unit_id = 1; -- Legacy Data

DELETE FROM gov_units
	WHERE gov_unit_id = 1; -- Legacy Data

# --- !Downs

INSERT INTO gov_units VALUES (1, 'Legacy Data', null, 1);

UPDATE users
	SET gov_unit_id = 1 -- Legacy Data
	WHERE user_id = 1; -- Legacy Data

UPDATE roles
	SET role_permissions = array_remove(role_permissions, 7);

ALTER TABLE reqs
	DROP COLUMN gov_unit_id,
	DROP COLUMN req_legacy,
  DROP COLUMN executing_agency_id;