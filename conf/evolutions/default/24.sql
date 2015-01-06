# --- !Ups

CREATE TABLE attachment_metas (
  attachment_meta_id int PRIMARY KEY REFERENCES attachments(attachment_id) ON DELETE CASCADE,
  attachment_meta_latitude decimal,
  attachment_meta_longitude decimal,
  attachment_meta_date_taken timestamp
);;

# --- !Downs

DROP TABLE attachment_metas;;