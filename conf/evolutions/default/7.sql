# --- !Ups

CREATE TABLE saros (
    saro_id serial PRIMARY KEY,
    saro_number text NOT NULL UNIQUE,
    saro_public boolean NOT NULL DEFAULT FALSE,
    saro_amount numeric(12,2) NOT NULL
);;

CREATE TABLE projects (
    project_id serial PRIMARY KEY,
    req_id int NOT NULL REFERENCES reqs,
    project_source_id text NOT NULL,
    project_name text NOT NULL,
    project_amount numeric(12,2) NOT NULL,
    gov_unit_id int NOT NULL REFERENCES gov_units,
    project_type_id int NOT NULL REFERENCES project_types,
    project_scope project_scope NOT NULL DEFAULT 'Repair',
    saro_id int REFERENCES saros,
    project_funded boolean NOT NULL DEFAULT FALSE
);;

# --- !Downs

DROP TABLE IF EXISTS projects;;

DROP TABLE IF EXISTS saros;;