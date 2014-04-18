# --- !Ups

-- CREATE TYPE project_type AS ENUM(
-- 	'Infrastructure',
-- 	'Agriculture',
-- 	'School Building',
-- 	'Health Facilities',
-- 	'Shelter Units',
-- 	'Environment',
-- 	'Other'
-- );;

CREATE TYPE project_type AS ENUM(
	'BRIDGES',
	'WATER SYSTEM',
	'OTHERS',
	'FINANCIAL AID',
	'ROAD',
	'FLOOD CONTROL',
	'RIVER CONTROL',
	'RIVERS',
	'SCHOOL BUILDING',
	'SEAWALL',
	'EQUIPMENT',
	'IRRIGATION SYSTEM',
	'BUILDING',
	'HOUSE',
	'ROADS',
	'HOUSING UNITS',
	'EVAC CENTER'
);;

CREATE TYPE project_scope AS ENUM(
	'Reconstruction',
	'Repair and Rehabilitation',
	'Other'
);;

CREATE TABLE reqs (
	req_id serial PRIMARY KEY,
	req_description text NOT NULL,
	req_project_type project_type NOT NULL,
	req_amount numeric(10,2) NOT NULL,
	req_scope project_scope NOT NULL,
	req_date timestamp NOT NULL,
	req_code text NOT NULL,
	req_level int NOT NULL,
	req_validated boolean NOT NULL DEFAULT FALSE,
	req_rejected boolean NOT NULL DEFAULT FALSE,
	author_id int NOT NULL REFERENCES users(user_id),
	assessing_agency_id int REFERENCES agencys(agency_id),
	implementing_agency_id int REFERENCES agencys(agency_id),
	req_location text NOT NULL,
	req_remarks text,
	req_attachments int[] NOT NULL,
	req_disaster_type disaster_type NOT NULL,
	req_disaster_date timestamp NOT NULL,
	req_disaster_name text
);;

CREATE TABLE attachments (
	attachment_id serial PRIMARY KEY,
	attachment_date_uploaded timestamp NOT NULL DEFAULT NOW(),
	attachment_filename text NOT NULL,
	uploader_id int NOT NULL REFERENCES users(user_id)
);;

# --- !Downs

DROP TABLE IF EXISTS attachments;;

DROP TABLE IF EXISTS reqs;;

DROP TYPE IF EXISTS project_scope;;

DROP TYPE IF EXISTS project_type;;
