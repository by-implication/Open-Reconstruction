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

CREATE TABLE agencys (
	agency_id serial PRIMARY KEY,
	agency_name text NOT NULL
);;

CREATE TABLE requests (
	request_id serial PRIMARY KEY,
	request_date timestamp NOT NULL,
	request_code text NOT NULL,
	request_level int NOT NULL,
	request_rejected boolean NOT NULL DEFAULT FALSE,
	author_id int NOT NULL REFERENCES users(user_id),
	implementing_agency_id int NOT NULL REFERENCES agencys(agency_id),
	request_project_type project_type NOT NULL,
	request_description text NOT NULL,
	request_amount numeric(10,2) NOT NULL,
	request_location text NOT NULL,
	request_remarks text,
	request_attachments int[] NOT NULL,
	disaster_id int NOT NULL REFERENCES disasters
);;

# --- !Downs

DROP TABLE IF EXISTS requests;;

DROP TABLE IF EXISTS agencys;;

DROP TYPE IF EXISTS project_type;;
