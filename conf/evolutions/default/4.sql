# --- !Ups

CREATE TABLE events (
	event_id serial PRIMARY KEY,
	event_date timestamp NOT NULL,
	project_id int NOT NULL REFERENCES reqs
);;

# --- !Downs

DROP TABLE IF EXISTS events;;
