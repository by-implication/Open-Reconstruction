# --- !Ups

CREATE TYPE project_type AS ENUM(
	'Infrastructure',
	'Agriculture',
	'School Building',
	'Health Facilities',
	'Shelter Units',
	'Environment',
	'Other'
);;

CREATE TABLE reqs (
	req_id serial PRIMARY KEY,
	req_date timestamp NOT NULL,
	req_code text NOT NULL,
	req_level int NOT NULL,
	req_rejected boolean NOT NULL DEFAULT FALSE,
	author_id int NOT NULL REFERENCES users(user_id),
	implementing_agency_id int NOT NULL REFERENCES agencys(agency_id),
	req_project_type project_type NOT NULL,
	req_description text NOT NULL,
	req_amount numeric(10,2) NOT NULL,
	req_location text NOT NULL,
	req_remarks text,
	req_attachments int[] NOT NULL,
	disaster_id int NOT NULL REFERENCES disasters
);;

# --- !Downs

DROP TABLE IF EXISTS reqs;;

DROP TABLE IF EXISTS agencys;;

DROP TYPE IF EXISTS project_type;;
