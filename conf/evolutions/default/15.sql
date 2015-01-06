# --- !Ups

ALTER TABLE events ADD COLUMN event_legacy boolean NOT NULL DEFAULT false;

# --- !Downs

ALTER TABLE events DROP COLUMN event_legacy;
