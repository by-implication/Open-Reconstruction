# --- !Ups

-- CREATE TYPE project_type AS ENUM(
--  'Infrastructure',
--  'Agriculture',
--  'School Building',
--  'Health Facilities',
--  'Shelter Units',
--  'Environment',
--  'Other'
-- );;

--generated by csvParser.js
CREATE TYPE project_type AS ENUM(
'Bridge',
'Building',
'Equipment',
'Evac Center',
'Financial Aid',
'Flood Control',
'Housing',
'Irrigation System',
'River Control',
'Rivers',
'Road',
'School Building',
'Seawall',
'Water System',
'Others');;

CREATE TYPE project_scope AS ENUM(
    'Reconstruction',
    'Repair',
    'Prevention',
    'Other'
);;

CREATE TYPE disaster_type AS ENUM(
    'Typhoon',
    'Earthquake',
    'Flood',
    'Landslide',
    'Fire',
    'Anthropogenic',
    'None or Preventive'
);;

CREATE TABLE reqs (
    req_id serial PRIMARY KEY,
    req_description text NOT NULL,
    req_project_type project_type NOT NULL,
    req_amount numeric(15,2) NOT NULL,
    req_scope project_scope NOT NULL DEFAULT 'Repair',
    req_date timestamp NOT NULL DEFAULT NOW(),
    -- req_code text NOT NULL,
    req_level int NOT NULL DEFAULT 0,
    req_validated boolean NOT NULL DEFAULT FALSE,
    req_rejected boolean NOT NULL DEFAULT FALSE,
    author_id int NOT NULL REFERENCES users(user_id),
    assessing_agency_id int REFERENCES gov_units(gov_unit_id),
    implementing_agency_id int REFERENCES gov_units(gov_unit_id),
    req_location text NOT NULL,
    req_remarks text,
    req_attachment_ids int[] NOT NULL DEFAULT '{}',
    req_disaster_type disaster_type NOT NULL DEFAULT 'Typhoon',
    req_disaster_date timestamp NOT NULL,
    req_disaster_name text
);;

# --- !Downs

DROP TABLE IF EXISTS reqs;;

DROP TYPE IF EXISTS disaster_type;;

DROP TYPE IF EXISTS project_scope;;

DROP TYPE IF EXISTS project_type;;
