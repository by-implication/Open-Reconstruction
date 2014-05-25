# --- !Ups

CREATE TABLE saro2 (
    budg_yr text,
    auth_id text,
    legal_cd text,
    rel_type_cd text,
    clearance_cd text,
    rcpt_uacs_funding_source text,
    saro_no text,
    barcode text,
    rcpt_owner_cd text,
    issue_date text,
    bureau_cd text,
    uacs_fpap_id text,
    uacs_fpap_dsc text
);;

COPY saro2 FROM 'SARO_JAN_MAR2014_FINAL.csv' CSV ENCODING 'ISO_8859_9';;

# --- !Downs

DROP TABLE IF EXISTS saro2;;
