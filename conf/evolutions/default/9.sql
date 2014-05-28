# --- !Ups

CREATE TABLE saro_combined (
    auth_id text,
    barcode text,
    barcode_no text,
    budg_yr text,
    bureau_cd text,
    clearance_cd text,
    doc_type_cd text,
    fpap_cd text,
    issue_date text,
    legal_cd text,
    pap_desc text,
    program_cd text,
    rcpt_fund_cd text,
    rcpt_owner_cd text,
    rcpt_uacs_funding_source text,
    rel_type_cd text,
    saro_no text,
    src_cd text,
    status_date text,
    status_dsc text,
    uacs_fpap_dsc text,
    uacs_fpap_id text
);;

INSERT INTO saro_combined (
    budg_yr,
    src_cd,
    legal_cd,
    doc_type_cd,
    rel_type_cd,
    clearance_cd,
    program_cd,
    rcpt_fund_cd,
    saro_no,
    barcode_no,
    rcpt_owner_cd,
    issue_date,
    status_date,
    bureau_cd,
    status_dsc,
    fpap_cd,
    pap_desc
)
SELECT * FROM saro1;;

INSERT INTO saro_combined (
    budg_yr,
    auth_id,
    legal_cd,
    rel_type_cd,
    clearance_cd,
    rcpt_uacs_funding_source,
    saro_no,
    barcode,
    rcpt_owner_cd,
    issue_date,
    bureau_cd,
    uacs_fpap_id,
    uacs_fpap_dsc
)
SELECT * FROM saro2;;

# --- !Downs

DROP TABLE IF EXISTS saro_combined;;
