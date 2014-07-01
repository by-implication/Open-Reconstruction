# --- !Ups

ALTER TABLE reqs
	ADD COLUMN gov_unit_id int REFERENCES gov_units,
	ADD COLUMN req_legacy boolean NOT NULL DEFAULT FALSE;

UPDATE reqs
	SET gov_unit_id = users.gov_unit_id
	FROM users WHERE author_id = user_id;

ALTER TABLE reqs
	ALTER COLUMN gov_unit_id SET NOT NULL;

UPDATE roles
	SET role_permissions = array_append(role_permissions, 7)
	WHERE role_name = ANY(ARRAY['NGA', 'OCD']);

UPDATE reqs
	SET req_legacy = true
	WHERE author_id = 1;

# --- !Downs

UPDATE roles
	SET role_permissions = array_remove(role_permissions, 7);

ALTER TABLE reqs
	DROP COLUMN gov_unit_id,
	DROP COLUMN req_legacy;
