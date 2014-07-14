# --- !Ups

CREATE OR REPLACE FUNCTION latest_events() RETURNS TABLE(req_id int, event_date timestamp) AS $$
	SELECT req_id, MAX(event_date) FROM events GROUP BY req_id;;
$$ LANGUAGE sql;

# --- !Downs

DROP FUNCTION latest_events();
