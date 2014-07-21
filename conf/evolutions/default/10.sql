# --- !Ups

CREATE TABLE projects (
  project_id serial PRIMARY KEY,
  req_id int NOT NULL REFERENCES reqs ON DELETE CASCADE,
  project_source_id text NOT NULL,
  project_name text NOT NULL,
  project_amount numeric(12, 2) NOT NULL,
  project_type_id int NOT NULL REFERENCES project_types,
  project_scope project_scope NOT NULL DEFAULT 'Repair',
  project_funded boolean NOT NULL DEFAULT FALSE,
  project_bid_price numeric(12, 2),
	project_contract_id text,
	project_contract_cost numeric(12, 2),
	project_contract_start timestamp,
	project_contract_end timestamp
);;

# --- !Downs

DROP TABLE IF EXISTS projects;;