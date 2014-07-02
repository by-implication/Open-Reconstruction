# --- !Ups

CREATE TABLE requirements (
	requirement_id serial PRIMARY KEY,
	requirement_name text NOT NULL,
	requirement_description text NOT NULL,
	req_level int NOT NULL,
	role_id int NOT NULL REFERENCES roles
);

# --- !Downs

DROP TABLE requirements;