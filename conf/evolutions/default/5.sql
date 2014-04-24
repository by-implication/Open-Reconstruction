# --- !Ups
-- convention for parent id:
-- negative values reference provinces as defined in Lgu.scala
-- positive values reference existing LGUs

CREATE TABLE lgus (
    lgu_id serial PRIMARY KEY REFERENCES agencys(agency_id),
    parent_id int NOT NULL
);;

# --- !Downs

DROP TABLE IF EXISTS lgus;;
