# --- !Ups

CREATE TABLE municipality_classes (
  psgc ltree,
  legislative_district text,
  city_class text,
  income_class text,
  name text
);

COPY municipality_classes FROM 'municipality_classes.csv' CSV ENCODING 'ISO_8859_9';

UPDATE municipality_classes
	SET income_class = substring(trim(income_class) for 1);

DELETE FROM municipality_classes
	WHERE NOT isnumeric(income_class)
	OR income_class IS NULL;

UPDATE lgus
	SET lgu_municipality_class = income_class::int
	FROM municipality_classes
	WHERE psgc = lgu_psgc;

# --- !Downs

DROP TABLE municipality_classes;
