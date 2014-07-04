# --- !Ups

ALTER TABLE lgus ADD UNIQUE(lgu_psgc);

CREATE OR REPLACE FUNCTION filter_zeros(int[]) RETURNS int[] AS $$
	BEGIN
		RETURN ARRAY(SELECT a.e FROM unnest($1) AS a(e) WHERE a.e != 0 );;
	END;;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION psgcify(text) RETURNS ltree AS $$
	BEGIN
		RETURN text2ltree(array_to_string(
			filter_zeros(regexp_matches(lpad($1, 6, '0'), '(\d{2})(\d{2})(\d{2})')::int[]), '.'
		));;
	END;;
$$ LANGUAGE plpgsql;

UPDATE reqs
	SET req_location = psgcify(req_location)
	WHERE isnumeric(req_location);

# --- !Downs

DROP FUNCTION psgcify;
DROP FUNCTION filter_zeros;