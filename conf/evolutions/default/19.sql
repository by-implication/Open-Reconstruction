# --- !Ups

ALTER TABLE events ADD COLUMN event_legacy boolean NOT NULL DEFAULT false;

ALTER TABLE reqs
  DROP COLUMN req_validated,
  DROP COLUMN req_remarks;

# --- !Downs

ALTER TABLE reqs
  ADD COLUMN req_validated boolean NOT NULL DEFAULT false,
  ADD COLUMN req_remarks text;

ALTER TABLE events DROP COLUMN event_legacy;