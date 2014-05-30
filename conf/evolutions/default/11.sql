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

# --- !Downs

DROP TABLE IF EXISTS oparr_bohol;;
