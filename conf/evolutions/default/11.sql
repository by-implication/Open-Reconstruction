# --- !Ups

SET datestyle = "ISO, MDY";;

CREATE TABLE oparr_bohol (
    group_id text,
    project_id text,
    region text,
    province text,
    municipality text,
    project_name text,
    project_type text,
    scope text,
    amount text,
    disaster_name text,
    implementing_agency text,
    psgc text,
    latitude decimal,
    longitude decimal,
    scope_type text,
    source text
);;

COPY oparr_bohol FROM 'oparr_bohol.csv' CSV ENCODING 'ISO_8859_9';;

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
  actual_start_year integer,
  actual_start_month integer,
  actual_percentage_started decimal,
  actual_completion_year integer,
  actual_completion_month integer,
  actual_percentage_completed decimal,
  completed_amount decimal,
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
  activity_12 text,
  activity_12_start_date timestamp,
  activity_12_end_date timestamp,
  activity_13 text,
  activity_13_start_date timestamp,
  activity_13_end_date timestamp,
  activity_14 text,
  activity_14_start_date timestamp,
  activity_14_end_date timestamp,
  activity_15 text,
  activity_15_start_date timestamp,
  activity_15_end_date timestamp,
  activity_16 text,
  activity_16_start_date timestamp,
  activity_16_end_date timestamp,
  activity_17 text,
  activity_17_start_date timestamp,
  activity_17_end_date timestamp,
  activity_18 text,
  activity_18_start_date timestamp,
  activity_18_end_date timestamp,
  activity_19 text,
  activity_19_start_date timestamp,
  activity_19_end_date timestamp,
  activity_20 text,
  activity_20_start_date timestamp,
  activity_20_end_date timestamp,
  activity_21 text,
  activity_21_start_date timestamp,
  activity_21_end_date timestamp,
  activity_22 text,
  activity_22_start_date timestamp,
  activity_22_end_date timestamp,
  activity_23 text,
  activity_23_start_date timestamp,
  activity_23_end_date timestamp,
  activity_24 text,
  activity_24_start_date timestamp,
  activity_24_end_date timestamp,
  activity_25 text,
  activity_25_start_date timestamp,
  activity_25_end_date timestamp,
  activity_26 text,
  activity_26_start_date timestamp,
  activity_26_end_date timestamp,
  activity_27 text,
  activity_27_start_date timestamp,
  activity_27_end_date timestamp,
  activity_28 text,
  activity_28_start_date timestamp,
  activity_28_end_date timestamp,
  activity_29 text,
  activity_29_start_date timestamp,
  activity_29_end_date timestamp,
  activity_30 text,
  activity_30_start_date timestamp,
  activity_30_end_date timestamp,
  project_type text,
  months_of_completion integer,
  disaster text,
  psgc text,
  SAA_number text,
  saro_abm_number  text,
  financial_allotment  decimal,
  financial_obligation decimal,
  financial_disbursement decimal,
  physical_planned decimal,
  physical_revised decimal,
  physical_actual  decimal,
  physical_slippage  decimal,
  physical_performance_index decimal
);;

COPY dpwh_eplc FROM '140531 EPLC - Consolidated bohol yolanda - 2013-2014 dpwh.csv' CSV ENCODING 'ISO_8859_9';;

CREATE TABLE saro_bureau_g (
    agency text,
    saro_number text,
    saro_date timestamp,
    year integer,
    amount decimal,
    project_quantity integer,
    remarks text
);;

COPY saro_bureau_g FROM '140531 Clean_SARO_BureauG.csv' CSV ENCODING 'ISO_8859_9';;

# --- !Downs

DROP TABLE IF EXISTS saro_bureau_g;;

DROP TABLE IF EXISTS dpwh_eplc;;

DELETE FROM reqs WHERE project_type_id IN
    (SELECT project_type_id FROM project_types WHERE project_type_name = any('{Mixed, Health Facility, Power Restoration, Port, Public Tourism Facility}'));;

DELETE FROM project_types
    WHERE project_type_name = any('{Mixed, Health Facility, Power Restoration, Port, Public Tourism Facility}');;

DROP TABLE IF EXISTS oparr_bohol;;
