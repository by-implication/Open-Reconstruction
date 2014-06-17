# --- !Ups

-- create OPARR-Bohol requests

INSERT INTO reqs (req_description, project_type_id, req_disaster_name, 
  req_amount, author_id, req_location, req_disaster_date,
  disaster_type_id)
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
  ) as amount,
  1 as author_id, psgc as loc,
  CASE 
    WHEN disaster_name ilike '%bohol%' THEN '2013-10-15'::date
    WHEN disaster_name ilike '%yolanda%' THEN '2013-11-8'::date
    ELSE now()
    END as disaster_date,
  CASE 
    WHEN disaster_name ilike '%bohol%' THEN 2
    WHEN disaster_name ilike '%yolanda%' THEN 1
    ELSE 7
    END as disaster_type
FROM oparr_bohol
LEFT JOIN project_types on initcap(project_type_name) = initcap(project_type)
GROUP BY group_id, disaster_name, oparr_bohol.psgc;;

-- create DPWH EPLC requests

INSERT INTO reqs (req_description, project_type_id, req_amount,
  author_id, req_location, disaster_type_id, 
  req_disaster_date, req_date, req_disaster_name, req_remarks
  )
SELECT project_description, 
  1 as project_type_id,
  coalesce(project_abc*1000, 0) as amount,
  1 as author_id,
  psgc, 
  CASE 
    WHEN disaster ilike '%typhoon%' THEN 1
    WHEN disaster ilike '%earthquake%' THEN 2
    ELSE 7
    END as disaster_type,
  CASE 
    WHEN disaster ilike '%bohol%' THEN '2013-10-15'::date
    WHEN disaster ilike '%yolanda%' THEN '2013-11-8'::date
    ELSE now()
    END as disaster_date,
  activity_1_start_date as req_date,
  disaster,
  project_id
FROM dpwh_eplc;;

# --- !Downs

