# --- !Ups

CREATE TABLE project_types (
    project_type_id serial PRIMARY KEY,
    project_type_name text NOT NULL
);;

INSERT INTO project_types VALUES
    (DEFAULT, 'Bridge'),
    (DEFAULT, 'Building'),
    (DEFAULT, 'Equipment'),
    (DEFAULT, 'Evac Center'),
    (DEFAULT, 'Financial Aid'),
    (DEFAULT, 'Flood Control'),
    (DEFAULT, 'Housing'),
    (DEFAULT, 'Irrigation System'),
    (DEFAULT, 'River Control'),
    (DEFAULT, 'Rivers'),
    (DEFAULT, 'Road'),
    (DEFAULT, 'School Building'),
    (DEFAULT, 'Seawall'),
    (DEFAULT, 'Water System'),
    (DEFAULT, 'Others')
;;

CREATE TYPE project_scope AS ENUM(
    'Reconstruction',
    'Repair',
    'Prevention'
);;

CREATE TABLE disaster_types (
    disaster_type_id serial PRIMARY KEY,
    disaster_type_name text NOT NULL
);;

INSERT INTO disaster_types VALUES
    (DEFAULT, 'Typhoon'),
    (DEFAULT, 'Earthquake'),
    (DEFAULT, 'Flood'),
    (DEFAULT, 'Landslide'),
    (DEFAULT, 'Fire'),
    (DEFAULT, 'Anthropogenic'),
    (DEFAULT, 'None or Preventive')
;;

CREATE TABLE reqs (
    req_id serial PRIMARY KEY,
    req_description text NOT NULL,
    project_type_id int NOT NULL REFERENCES project_types,
    req_amount numeric(15,2) NOT NULL,
    req_date timestamp NOT NULL DEFAULT NOW(),
    req_level int NOT NULL DEFAULT 0,
    req_validated boolean NOT NULL DEFAULT FALSE,
    req_rejected boolean NOT NULL DEFAULT FALSE,
    author_id int NOT NULL REFERENCES users(user_id),
    assessing_agency_id int REFERENCES gov_units(gov_unit_id),
    implementing_agency_id int REFERENCES gov_units(gov_unit_id),
    req_location text NOT NULL,
    req_remarks text,
    req_attachment_ids int[] NOT NULL DEFAULT '{}',
    disaster_type_id int NOT NULL REFERENCES disaster_types DEFAULT 1,
    req_disaster_date timestamp NOT NULL,
    req_disaster_name text,
    saro_no text
);;

# --- !Downs

DROP TABLE IF EXISTS reqs;;

DROP TABLE IF EXISTS disaster_type;;

DROP TYPE IF EXISTS project_scope;;

DROP TABLE IF EXISTS project_type;;
