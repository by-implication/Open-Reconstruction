# --- !Ups

SET datestyle = "ISO, MDY";;

INSERT INTO roles VALUES
    (1, 'LGU', '{1}'),
    (2, 'OCD', '{3, 5}'),
    (3, 'OP', '{5}'),
    (4, 'DPWH', '{1, 2, 3, 4, 5}'),
    (5, 'DBM', '{1, 5, 6}'),
    (6, 'NGA', '{1, 4}');;

INSERT INTO gov_units VALUES
    (DEFAULT, 'Legacy Data', null, 1),
    (DEFAULT, 'Office of Civil Defense', 'OCD', 2),
    (DEFAULT, 'Office of the President', 'OP', 3),
    (DEFAULT, 'Department of Public Works and Highways', 'DPWH', 4),
    (DEFAULT, 'Department of Budget and Management', 'DBM', 5),
    (DEFAULT, 'Department of the Interior and Local Government', 'DILG', 4),
    (DEFAULT, 'Office of the Presidential Assistant for Rehabilitation and Recovery', 'OPARR', 2);;
--generated by csvParser.js

COPY gov_units FROM 'gov_units.csv' CSV ENCODING 'ISO_8859_9';;

ALTER SEQUENCE gov_units_gov_unit_id_seq RESTART WITH 43822;;

INSERT INTO gov_units VALUES
  (DEFAULT, 'Commission on Higher Education', 'CHED', 6),
  (DEFAULT, 'Department of Agrarian Reform', 'DAR', 6),
  (DEFAULT, 'Department of Agriculture', 'DA', 6),
  (DEFAULT, 'Department of Education', 'DepEd', 6),
  (DEFAULT, 'Department of Energy', 'DOE', 6),
  (DEFAULT, 'Department of Environment and Natural Resources', 'DENR', 6),
  (DEFAULT, 'Department of Finance', 'DOF', 6),
  (DEFAULT, 'Department of Health', 'DOH', 6),
  (DEFAULT, 'Department of Justice', 'DOJ', 6),
  (DEFAULT, 'Department of Labor and Employment', 'DOLE', 6),
  (DEFAULT, 'Department of Science and Technology', 'DOST', 6),
  (DEFAULT, 'Department of Social Welfare and Development', 'DSWD', 6),
  (DEFAULT, 'Department of Tourism', 'DOT', 6),
  (DEFAULT, 'Department of Trade and Industry', 'DTI', 6),
  (DEFAULT, 'Department of Transportation and Communications', 'DOTC', 6),
  (DEFAULT, 'Local Water Utilities Administration', 'LWUA', 6),
  (DEFAULT, 'National Irrigation Administration', 'NIA', 6),
  (DEFAULT, 'National Telecommunications Commission', 'NTC', 6),
  (DEFAULT, 'Office of the Presidential Assistant for Rehabilitation and Recovery', 'OPARR', 6),
  (DEFAULT, 'Technical Education and Skills Development Authority', 'TESDA', 6);;

COPY lgus FROM 'lgus.csv' CSV;;

INSERT INTO users VALUES
    (DEFAULT, 'legacy', 'Legacy Data', crypt('password', gen_salt('bf')), 1, true);;

# --- !Downs

TRUNCATE users CASCADE;;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;;

TRUNCATE lgus CASCADE;;

TRUNCATE gov_units CASCADE;;
ALTER SEQUENCE gov_units_gov_unit_id_seq RESTART WITH 1;;

TRUNCATE roles CASCADE;;
