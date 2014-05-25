# --- !Ups

CREATE TABLE saro1 (
    budg_yr text,
    src_cd text,
    legal_cd text,
    doc_type_cd text,
    rel_type_cd text,
    clearance_cd text,
    program_cd text,
    rcpt_fund_cd text,
    saro_no text,
    barcode_no text,
    rcpt_owner_cd text,
    issue_date text,
    status_date text,
    bureau_cd text,
    status_dsc text,
    fpap_cd text,
    pap_desc text
);;

COPY saro1 FROM 'SARO_NOV_DEC2013_FINAL.csv' CSV ENCODING 'ISO_8859_9';;

# --- !Downs

DROP TABLE IF EXISTS saro1;;
