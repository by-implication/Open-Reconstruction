# --- !Ups

CREATE TABLE events (
	event_id serial PRIMARY KEY,
    event_kind text NOT NULL,
	event_date timestamp NOT NULL,
    event_content text,
    req_id int NOT NULL REFERENCES reqs
);;

# --- !Downs

DROP TABLE IF EXISTS events;;
