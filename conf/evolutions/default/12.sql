# --- !Ups

-- create OPARR-Bohol requests

INSERT INTO reqs (req_description, project_type_id, req_disaster_name, 
  req_amount, author_id, req_location, req_disaster_date, req_date,
  disaster_type_id, assessing_agency_id, implementing_agency_id, req_level)
SELECT group_id,
  CASE 
    WHEN array_agg(DISTINCT project_type_id) = ARRAY[NULL]::INT[] THEN 
      (SELECT project_type_id FROM project_types WHERE project_type_name = 'Others')
    WHEN count(DISTINCT project_type) = 1 THEN (array_agg(project_type_id))[1]
    ELSE (SELECT project_type_id from project_types WHERE project_type_name = 'Mixed')
  END AS project_type_id,
  trim(disaster_name), 
  SUM( CASE
    WHEN oparr_bohol.amount = '-' THEN 0
    ELSE oparr_bohol.amount::numeric(12,2)
    END
  ) AS amount,
  1 AS author_id, psgc AS loc,
  CASE 
    WHEN disaster_name ilike '%bohol%' THEN '2013-10-15'::date
    WHEN disaster_name ilike '%yolanda%' THEN '2013-11-8'::date
    ELSE now()
    END AS disaster_date,
  CASE 
    WHEN disaster_name ilike '%bohol%' THEN '2013-12-10'::date
    WHEN disaster_name ilike '%yolanda%' THEN '2014-5-18'::date
    ELSE now()
    END AS req_date,
  CASE 
    WHEN disaster_name ilike '%bohol%' THEN 2
    WHEN disaster_name ilike '%yolanda%' THEN 1
    ELSE 7
    END AS disaster_type,
  agencies.gov_unit_id,
  agencies.gov_unit_id,
  CASE
    WHEN oparr_bohol.status ilike 'Funded (2.3B Release)' THEN 5
    ELSE 0
    END AS level
FROM oparr_bohol
LEFT JOIN project_types on initcap(project_type_name) = initcap(project_type)
LEFT JOIN (
  SELECT gov_unit_id, gov_unit_acronym FROM gov_units 
  WHERE gov_unit_acronym IS NOT NULL
) AS agencies on oparr_bohol.implementing_agency ilike agencies.gov_unit_acronym
GROUP BY group_id, disaster_name, oparr_bohol.psgc, agencies.gov_unit_id, oparr_bohol.status;;

-- create DPWH EPLC requests

INSERT INTO reqs (req_description, project_type_id, req_amount,
  author_id, req_location, disaster_type_id, 
  req_disaster_date, req_date, req_disaster_name, req_remarks,
  assessing_agency_id, implementing_agency_id, req_level
  )
SELECT project_description, 
  COALESCE((SELECT project_type_id FROM project_types
    WHERE project_type = project_type_name
    LIMIT 1
  ), 15) AS project_type_id, -- default to 'Others'
  coalesce(project_abc*1000, 0) AS amount,
  1 AS author_id,
  psgc, 
  CASE 
    WHEN disaster ilike '%typhoon%' THEN 1
    WHEN disaster ilike '%earthquake%' THEN 2
    ELSE 7
    END AS disaster_type,
  CASE 
    WHEN disaster ilike '%bohol%' THEN '2013-10-15'::date
    WHEN disaster ilike '%yolanda%' THEN '2013-11-8'::date
    ELSE now()
    END AS disaster_date,
  activity_1_start_date AS req_date,
  disaster,
  project_id,
  (SELECT gov_unit_id FROM gov_units 
    WHERE gov_unit_acronym ilike 'dpwh'
    LIMIT 1
  ) AS assessing_agency_id,
  (SELECT gov_unit_id FROM gov_units 
    WHERE gov_unit_acronym ilike 'dpwh'
    LIMIT 1
  ) AS implementing_agency_id,
  6 AS req_level
FROM dpwh_eplc;;

-- create DILG RAY requests

INSERT INTO reqs (req_description, project_type_id, req_amount,
  author_id, req_location, disaster_type_id, 
  req_disaster_date, req_date, req_disaster_name, req_remarks,
  assessing_agency_id, implementing_agency_id, req_level
  )
SELECT group_id,
  (SELECT project_type_id FROM project_types
    WHERE project_type = project_type_name
    LIMIT 1
  ) AS project_type_id,
  amount,
  1 AS author_id,
  psgc, 
  CASE 
    WHEN disaster_name ilike '%typhoon%' THEN 1
    WHEN disaster_name ilike '%earthquake%' THEN 2
    ELSE 7
    END AS disaster_type,
  CASE 
    WHEN disaster_name ilike '%bohol%' THEN '2013-10-15'::date
    WHEN disaster_name ilike '%yolanda%' THEN '2013-11-8'::date
    ELSE now()
    END AS disaster_date,
  req_date,
  disaster_name,
  project_id,
  (SELECT gov_unit_id FROM gov_units 
    WHERE gov_unit_acronym ilike 'dilg'
    LIMIT 1
  ) AS assessing_agency_id,
  (SELECT gov_unit_id FROM gov_units 
    WHERE gov_unit_acronym ilike 'dilg'
    LIMIT 1
  ) AS implementing_agency_id,
  6 AS req_level
FROM dilg_ray;;

# --- !Downs

