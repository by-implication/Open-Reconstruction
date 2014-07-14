# --- !Ups

ALTER TABLE users
	ADD COLUMN user_last_feed_visit timestamp NOT NULL DEFAULT NOW();

# --- !Downs

ALTER TABLE users
	DROP COLUMN user_last_feed_visit;
