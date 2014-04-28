# --- !Ups

CREATE TABLE attachments (
    attachment_id serial PRIMARY KEY,
    attachment_date_uploaded timestamp NOT NULL DEFAULT NOW(),
    attachment_filename text NOT NULL,
    uploader_id int NOT NULL REFERENCES users(user_id),
    attachment_image boolean NOT NULL,
    req_id int NOT NULL REFERENCES reqs
);;

CREATE TABLE events (
	event_id serial PRIMARY KEY,
    event_kind text NOT NULL,
	event_date timestamp NOT NULL,
    event_content text,
    req_id int NOT NULL REFERENCES reqs,
    user_id int REFERENCES users
);;

CREATE TABLE checkpoints (
    req_id int NOT NULL REFERENCES reqs(req_id),
    gov_unit_id int NOT NULL REFERENCES gov_units(gov_unit_id),
    user_id int REFERENCES users(user_id),
    checkpoint_level int NOT NULL,
    checkpoint_date_received timestamp NOT NULL DEFAULT NOW(),
    checkpoint_date_completed timestamp
);;

# --- !Downs

DROP TABLE IF EXISTS checkpoints;;

DROP TABLE IF EXISTS events;;

DROP TABLE IF EXISTS attachments;;
