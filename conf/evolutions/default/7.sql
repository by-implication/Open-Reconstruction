# --- !Ups

SET datestyle = "ISO, MDY";;

CREATE TABLE oparr_bohol (
  group_id text,
  project_id text,
  implementation_pms_id text,
  implementation_pms text,
  uacs_code text,
  region text,
  province text,
  municipality text,
  project_name text,
  project_type text,
  scope text,
  amount text,
  disaster_name text,
  disaster_date timestamp,
  implementing_agency text,
  psgc text,
  latitude decimal,
  longitude decimal,
  source text,
  status text,
  version text
);;

COPY oparr_bohol FROM 'oparr_bohol.csv' CSV ENCODING 'ISO_8859_9';;

CREATE TABLE dilg_ray (
  dilg_id text,
  group_id text,
  project_id text,
  project_name text,
  project_type text,
  amount numeric(12,2),
  scope project_scope,
  req_date date,
  implementing_agency text,
  disaster_date date,
  disaster_name text,
  region text,
  province text,
  municipality text,
  psgc text
);;

COPY dilg_ray FROM 'dilg_ray.csv' CSV ENCODING 'ISO_8859_9';;

INSERT INTO project_types VALUES
  (DEFAULT, 'Mixed'),
  (DEFAULT, 'Health Facility'),
  (DEFAULT, 'Power Restoration'),
  (DEFAULT, 'Port'),
  (DEFAULT, 'Public Tourism Facility')
;;

ALTER TYPE project_scope ADD VALUE IF NOT EXISTS 'Others';;

CREATE TABLE dpwh_eplc (
  project_id text,
  project_description text,
  contract_id text,
  contract_desc text,
  contract_cost decimal,
  project_cost decimal,
  contract_start_date timestamp,
  contract_end_date timestamp,
  contract_duration integer,
  gaa_id integer,
  budget_year integer,
  fs_type text,
  fs_tname text,
  fund_code text,
  inst_name text,
  inst_code text,
  loan_number text,
  loan_package integer,
  loan_sub_package integer,
  pms_inauguration integer,
  const_budget decimal,
  project_location text,
  scope text,
  physical_type_tag text,
  physical decimal,
  unit_desc text,
  office_id text,
  region text,
  implementing_office text,
  project_engineer text,
  project_contractor text,
  project_proponent text,
  project_consultant text,
  notice_to_proceed timestamp,
  project_abc decimal,
  bid_price decimal,
  number_of_bidder integer,
  completed_amount decimal,
  actual_start_year integer,
  actual_start_month integer,
  actual_percentage_started decimal,
  actual_completion_year integer,
  actual_completion_month integer,
  actual_percentage_completed decimal,
  physical_planned decimal,
  physical_revised decimal,
  physical_actual decimal,
  physical_slippage decimal,
  physical_performance_index decimal,
  implementation_mode text,
  irr_pk integer,
  irr_description text,
  activity_1 text,
  activity_1_start_date timestamp,
  activity_1_end_date timestamp,
  activity_2 text,
  activity_2_start_date timestamp,
  activity_2_end_date timestamp,
  activity_3 text,
  activity_3_start_date timestamp,
  activity_3_end_date timestamp,
  activity_4 text,
  activity_4_start_date timestamp,
  activity_4_end_date timestamp,
  activity_5 text,
  activity_5_start_date timestamp,
  activity_5_end_date timestamp,
  activity_6 text,
  activity_6_start_date timestamp,
  activity_6_end_date timestamp,
  activity_7 text,
  activity_7_start_date timestamp,
  activity_7_end_date timestamp,
  activity_8 text,
  activity_8_start_date timestamp,
  activity_8_end_date timestamp,
  activity_9 text,
  activity_9_start_date timestamp,
  activity_9_end_date timestamp,
  activity_10 text,
  activity_10_start_date timestamp,
  activity_10_end_date timestamp,
  activity_11 text,
  activity_11_start_date timestamp,
  activity_11_end_date timestamp,
  SAA_NO text,
  SAA_DATE timestamp,
  SAA_AMOUNT decimal,
  SARO_NUMBER text,
  SARO_match boolean,
  obligation_amount decimal,
  disbursement decimal,
  financial_progress decimal,
  project_type text,
  months_of_completion integer,
  disaster text,
  psgc text,
  psgc_level text,
  latitude decimal,
  longitude decimal,
  allotment_date timestamp,
  plan_nov_2013 decimal,
  plan_dec_2013 decimal,
  plan_jan_2014 decimal,
  plan_feb_2014 decimal,
  plan_mar_2014 decimal,
  plan_apr_2014 decimal,
  plan_may_2014 decimal,
  plan_jun_2014 decimal,
  plan_jul_2014 decimal,
  plan_aug_2014 decimal,
  plan_sep_2014 decimal,
  plan_oct_2014 decimal,
  plan_nov_2014 decimal,
  plan_dec_2014 decimal,
  plan_jan_2015 decimal,
  plan_feb_2015 decimal,
  plan_mar_2015 decimal,
  plan_apr_2015 decimal,
  plan_may_2015 decimal,
  plan_jun_2015 decimal,
  plan_jul_2015 decimal,
  plan_aug_2015 decimal,
  plan_sep_2015 decimal,
  plan_oct_2015 decimal,
  plan_nov_2015 decimal,
  plan_dec_2015 decimal,
  revise_nov_2013 decimal,
  revise_dec_2013 decimal,
  revise_jan_2014 decimal,
  revise_feb_2014 decimal,
  revise_mar_2014 decimal,
  revise_apr_2014 decimal,
  revise_may_2014 decimal,
  revise_jun_2014 decimal,
  revise_jul_2014 decimal,
  revise_aug_2014 decimal,
  revise_sep_2014 decimal,
  revise_oct_2014 decimal,
  revise_nov_2014 decimal,
  revise_dec_2014 decimal,
  revise_jan_2015 decimal,
  revise_feb_2015 decimal,
  revise_mar_2015 decimal,
  revise_apr_2015 decimal,
  revise_may_2015 decimal,
  revise_jun_2015 decimal,
  revise_jul_2015 decimal,
  revise_aug_2015 decimal,
  revise_sep_2015 decimal,
  revise_oct_2015 decimal,
  revise_nov_2015 decimal,
  revise_dec_2015 decimal,
  actual_nov_2013 decimal,
  actual_dec_2013 decimal,
  actual_jan_2014 decimal,
  actual_feb_2014 decimal,
  actual_mar_2014 decimal,
  actual_apr_2014 decimal,
  actual_may_2014 decimal,
  actual_jun_2014 decimal,
  actual_jul_2014 decimal,
  actual_aug_2014 decimal,
  actual_sep_2014 decimal,
  actual_oct_2014 decimal,
  actual_nov_2014 decimal,
  actual_dec_2014 decimal,
  actual_jan_2015 decimal,
  actual_feb_2015 decimal,
  actual_mar_2015 decimal,
  actual_apr_2015 decimal,
  actual_may_2015 decimal,
  actual_jun_2015 decimal,
  actual_jul_2015 decimal,
  actual_aug_2015 decimal,
  actual_sep_2015 decimal,
  actual_oct_2015 decimal,
  actual_nov_2015 decimal,
  actual_dec_2015 decimal
);;

COPY dpwh_eplc FROM 'dpwh_eplc.csv' CSV ENCODING 'ISO_8859_9';;

CREATE TABLE saro_bureau_g (
  agency text,
  match_status text,
  saro_number text,
  saro_date date,
  month text,
  year integer,
  amount decimal,
  fund_source text,
  disaster text,
  disaster_date date,
  dataset_source text,
  remarks text,
  eplc_id text
);;

COPY saro_bureau_g FROM 'Clean_SARO_BureauG.csv' CSV ENCODING 'ISO_8859_9';;

# --- !Downs

DROP TABLE IF EXISTS saro_bureau_g;;

DROP TABLE IF EXISTS dpwh_eplc;;

DELETE FROM reqs WHERE project_type_id IN
    (SELECT project_type_id FROM project_types WHERE project_type_name = any('{Mixed, Health Facility, Power Restoration, Port, Public Tourism Facility}'));;

DELETE FROM project_types
    WHERE project_type_name = any('{Mixed, Health Facility, Power Restoration, Port, Public Tourism Facility}');;

DROP TABLE IF EXISTS oparr_bohol;;
