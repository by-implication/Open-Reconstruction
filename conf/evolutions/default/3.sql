# --- !Ups

CREATE TYPE project_types AS ENUM(
	'Infrastructure',
	'Agriculture',
	'School Building',
	'Health Facilities',
	'Shelter Units',
	'Environment',
	'Other'
);;

CREATE TABLE projects (
	project_id serial PRIMARY KEY,
	project_date timestamp NOT NULL,
	project_code text NOT NULL,
	project_level int NOT NULL,
	project_rejected boolean NOT NULL DEFAULT FALSE,
	author_id int NOT NULL REFERENCES users(user_id),
	implementing_agency_id int NOT NULL REFERENCES agencys(agency_id),
	project_kind project_types NOT NULL,
	project_description text NOT NULL,
	project_amount numeric(10,2) NOT NULL,
	project_location text NOT NULL,
	project_remarks text,
	project_attachments int[] NOT NULL,
	disaster_id int NOT NULL REFERENCES disasters
);;

# --- !Downs

DROP TABLE IF EXISTS projects;;

DROP TYPE IF EXISTS project_types;;
