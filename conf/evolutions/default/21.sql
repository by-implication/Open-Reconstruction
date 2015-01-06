# --- !Ups

UPDATE reqs
	SET req_level = 1
	WHERE req_level = 0
	AND implementing_agency_id IS NOT NULL;
	
# --- !Downs
