# --- !Ups

ALTER TABLE reqs
	ADD COLUMN project_id int DEFAULT 0;

INSERT INTO reqs (req_description, project_type_id, req_amount, author_id, req_location,
	req_date, disaster_id, assessing_agency_id, implementing_agency_id, req_level, gov_unit_id,
	project_id)
SELECT p.project_name, r.project_type_id, p.project_amount, author_id, req_location,
	req_date, disaster_id, assessing_agency_id, implementing_agency_id, req_level, gov_unit_id,
	p.project_id
FROM projects p LEFT JOIN reqs r ON p.req_id = r.req_id;

UPDATE projects p
	SET req_id = r.req_id
	FROM reqs r
	WHERE r.project_id = p.project_id;

DELETE FROM projects p
	WHERE project_id IN (
		SELECT p.project_id
		FROM projects p LEFT JOIN reqs r ON p.req_id = r.req_id
		WHERE r.project_id = 0
	);

DELETE FROM reqs
	WHERE project_id = 0;

ALTER TABLE reqs
	DROP COLUMN project_id;

# --- !Downs

