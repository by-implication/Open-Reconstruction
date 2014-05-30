# --- !Ups

CREATE TABLE oparr_bohol (
    group_id text,
    project_id text,
    region text,
    province text,
    municipality text,
    project_name text,
    project_type text,
    scope text,
    amount text,
    disaster_name text,
    implementing_agency text,
    scope_type text,
    source text
);;

COPY oparr_bohol FROM '140530 oparr_bohol.csv' CSV ENCODING 'ISO_8859_9';;

INSERT INTO project_types VALUES
  (DEFAULT, 'Mixed'),
  (DEFAULT, 'Health Facility'),
  (DEFAULT, 'Power Restoration'),
  (DEFAULT, 'Port'),
  (DEFAULT, 'Public Tourism Facility')
;;

ALTER TYPE project_scope ADD VALUE IF NOT EXISTS 'Others';;

# --- !Downs

DELETE FROM project_types
    WHERE project_type_name = any('{Mixed, Health Facility, Power Restoration, Port, Public Tourism Facility}');;

DROP TABLE IF EXISTS oparr_bohol;;
