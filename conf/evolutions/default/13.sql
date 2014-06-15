# --- !Ups

-- assign OPARR-Bohol projects

INSERT INTO projects (req_id, project_source_id, project_name, project_amount, gov_unit_id, project_type_id, project_scope, project_funded)
SELECT req_id, group_id, project_name, 
  CASE 
    WHEN amount = '-' THEN 0
    ELSE amount::numeric(12,2)
  END as amount,
  1 as gov_unit_id,
  coalesce(project_types.project_type_id, 
    (SELECT project_types.project_type_id FROM project_types WHERE project_type_name = 'Others')) as project_type_id,
  initcap(scope)::project_scope as scope,
  false
FROM oparr_bohol
LEFT JOIN reqs on req_description = group_id
LEFT JOIN project_types on initcap(project_type_name) = initcap(project_type)
WHERE oparr_bohol.psgc = reqs.req_location;;

-- assign DPWH EPLC projects

INSERT INTO projects (req_id, project_source_id,
  project_name, project_amount, gov_unit_id, 
  project_type_id, project_scope,
  project_funded)
SELECT req_id, dpwh_eplc.project_id,
  project_description,
  coalesce(project_abc*1000, 0),
  1 as gov_unit_id,
  1 as project_type_id,
  'Others'::project_scope as scope,
  true as is_funded
FROM dpwh_eplc
LEFT JOIN reqs on req_remarks = dpwh_eplc.project_id;;

# --- !Downs

