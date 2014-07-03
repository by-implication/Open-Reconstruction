# --- !Ups

ALTER TABLE reqs
	DROP COLUMN req_validated,
	DROP COLUMN req_remarks;

# --- !Downs

ALTER TABLE reqs
	ADD COLUMN req_validated boolean NOT NULL DEFAULT false,
	ADD COLUMN req_remarks text;