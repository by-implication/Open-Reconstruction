# --- !Ups

ALTER TABLE gov_units
	ADD COLUMN gov_unit_search_key text;

UPDATE gov_units
	SET gov_unit_search_key = gov_unit_name;

UPDATE gov_units g
	SET gov_unit_search_key = s.gov_unit_name
	FROM gov_units s, lgus l, lgus ls
	WHERE g.gov_unit_id = l.lgu_id
	AND s.gov_unit_id = ls.lgu_id
	AND subltree(l.lgu_psgc, 0, 2) = ls.lgu_psgc;

UPDATE gov_units g
	SET gov_unit_search_key = concat(s.gov_unit_name, ', ', g.gov_unit_search_key)
	FROM gov_units s, lgus l, lgus ls
	WHERE nlevel(l.lgu_psgc) > 2
	AND g.gov_unit_id = l.lgu_id
	AND s.gov_unit_id = ls.lgu_id
	AND subltree(l.lgu_psgc, 0, 3) = ls.lgu_psgc;

UPDATE gov_units g
	SET gov_unit_search_key = concat(s.gov_unit_name, ', ', g.gov_unit_search_key)
	FROM gov_units s, lgus l, lgus ls
	WHERE nlevel(l.lgu_psgc) > 3
	AND g.gov_unit_id = l.lgu_id
	AND s.gov_unit_id = ls.lgu_id
	AND subltree(l.lgu_psgc, 0, 4) = ls.lgu_psgc;

ALTER TABLE gov_units
	ALTER COLUMN gov_unit_search_key SET NOT NULL;

# --- !Downs

ALTER TABLE gov_units
	DROP COLUMN gov_unit_search_key;
