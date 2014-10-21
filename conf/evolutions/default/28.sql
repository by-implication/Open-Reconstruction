# --- !Ups

CREATE TABLE geotags (
  geotag_id int PRIMARY KEY REFERENCES attachments(attachment_id) ON DELETE CASCADE,
  geotag_latitude text,
  geotag_longitude text
);;

# --- !Downs

DROP TABLE geotags;;