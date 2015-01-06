# --- !Ups

CREATE TABLE disasters (
	disaster_id serial PRIMARY KEY,
	disaster_type_id int NOT NULL REFERENCES disaster_types DEFAULT 1,
	disaster_date timestamp NOT NULL,
	disaster_name text
);

ALTER TABLE reqs ADD COLUMN disaster_id int REFERENCES disasters;

INSERT INTO disasters (disaster_type_id, disaster_date, disaster_name)
	SELECT DISTINCT disaster_type_id, req_disaster_date, req_disaster_name FROM reqs;

UPDATE reqs SET disaster_id = d.disaster_id FROM disasters d
	WHERE reqs.disaster_type_id = d.disaster_type_id
	AND reqs.req_disaster_date = d.disaster_date
	AND reqs.req_disaster_name = d.disaster_name;

ALTER TABLE reqs
	DROP COLUMN disaster_type_id,
	DROP COLUMN req_disaster_date,
	DROP COLUMN req_disaster_name,
	ALTER COLUMN disaster_id SET NOT NULL;

# --- !Downs

ALTER TABLE reqs
	ADD COLUMN disaster_type_id int NOT NULL REFERENCES disaster_types DEFAULT 1,
	ADD COLUMN req_disaster_date timestamp NOT NULL,
	ADD COLUMN req_disaster_name text;

UPDATE reqs SET
	disaster_type_id = d.disaster_type_id,
	req_disaster_date = d.disaster_date,
	req_disaster_name = d.disaster_name
	FROM disasters d WHERE reqs.disaster_id = d.disaster_id;

ALTER TABLE reqs DROP COLUMN disaster_id;

DROP TABLE IF EXISTS disasters;
