# --- !Ups

ALTER TABLE reqs ADD COLUMN executing_agency_id int REFERENCES gov_units(gov_unit_id);

# --- !Downs

ALTER TABLE reqs DROP COLUMN executing_agency_id;