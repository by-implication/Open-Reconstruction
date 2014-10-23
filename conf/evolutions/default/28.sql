# --- !Ups

CREATE TABLE geotags (
  geotag_id int PRIMARY KEY REFERENCES attachments(attachment_id) ON DELETE CASCADE,
  geotag_latitude decimal,
  geotag_longitude decimal
);;

# --- !Downs

DROP TABLE geotags;;