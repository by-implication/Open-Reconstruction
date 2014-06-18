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
    (DEFAULT, 'Sample Barangay', null, 1);;
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
  (DEFAULT, 'Department of the Interior and Local Government', 'DILG', 6),
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
    (DEFAULT, 'legacy', 'Legacy Data', crypt('password', gen_salt('bf')), 1, true),
    (DEFAULT, 'disasteraffected', 'Disaster-Affected Area', crypt('getsupport', gen_salt('bf')), 6, true),
    (DEFAULT, 'ocd_test', 'OCD Test', crypt('getsupport', gen_salt('bf')), 2, true),
    (DEFAULT, 'op_test', 'OP Test', crypt('getsupport', gen_salt('bf')), 3, true),
    (DEFAULT, 'dpwh_test', 'DPWH Test', crypt('getsupport', gen_salt('bf')), 4, true),
    (DEFAULT, 'dbm_test', 'DBM Test', crypt('getsupport', gen_salt('bf')), 5, true),
    (DEFAULT, 'brgyoza', 'Brenda Repolyo Gyoza', crypt('password', gen_salt('bf')), 1, true),
    (DEFAULT, 'ocdeguzman', 'Oscar Clamidio De Guzman', crypt('password', gen_salt('bf')), 2, true),
    (DEFAULT, 'bsaquinoiii', 'Benigno S. Aquino III', crypt('password', gen_salt('bf')), 3, true),
    (DEFAULT, 'dpwhereford', 'David Pena Whereford', crypt('password', gen_salt('bf')), 4, true),
    (DEFAULT, 'dbmoya', 'Dersecretary Bon Moya', crypt('password', gen_salt('bf')), 5, true);;

INSERT INTO reqs (req_description, project_type_id, req_amount, req_date, author_id, req_location, req_disaster_date, req_disaster_name) VALUES
  ('[SAMPLE] REHABILITATION OF INFRASTRUCTURE PROJECT', 15, 0.00, '11/22/2013', 2, 'SAN ISIDRO, LEYTE, Region 8', '11/22/2013', 'Typhoon Yolanda'),
  ('[SAMPLE] REHABILITATION OF INFRASTRUCTURE PROJECT', 15, 0.00, '11/22/2013', 2, 'SAN ROQUE, NORTHERN SAMAR, Region 8', '11/22/2013', 'Typhoon Yolanda'),
  ('[SAMPLE] REPAIR/REHABILITATION OF SUCS BUILDINGS AND FACILITIES', 12, 4101042105.00, '02/14/2014', 2, '', '02/14/2014', 'Typhoon Yolanda'),
  ('[SAMPLE] REPAIR/RESTORATION OF INFRASTRUCTURE PROJECTS IN THE PROVINCE OF SURIGAO DEL NORTE AND DINAGAT ISLAND', 15, 2755000.00, '02/13/2014', 2, 'Region 13', '02/13/2014', 'Typhoon Yolanda'),
  ('[SAMPLE] REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 66819000.00, '01/21/2014', 2, 'CATANDUANES, Region 5', '01/21/2014', 'Typhoon Yolanda');;

INSERT INTO events VALUES
  (DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO VIII FOR INCLUSION ON THE PDNA FOR T YOLANDA', 1, 2),
  (DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO VIII FOR INCLUSION ON THE PDNA FOR T YOLANDA', 2, 2),
  (DEFAULT, 'newRequest', '11/22/2013', 'REHABILITATION OF INFRASTRUCTURE PROJECT', 1, 2),
  (DEFAULT, 'newRequest', '11/22/2013', 'REHABILITATION OF INFRASTRUCTURE PROJECT', 2, 2),
  (DEFAULT, 'newRequest', '02/13/2014', 'REPAIR/RESTORATION OF INFRASTRUCTURE PROJECTS IN THE PROVINCE OF SURIGAO DEL NORTE AND DINAGAT ISLAND', 3, 2),
  (DEFAULT, 'newRequest', '05/15/2013', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 4, 2),
  (DEFAULT, 'newRequest', '02/20/2014', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 5, 2),
  (DEFAULT, 'disaster', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 1, null),
  (DEFAULT, 'disaster', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 2, null),
  (DEFAULT, 'disaster', '02/13/2014', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 3, null),
  (DEFAULT, 'disaster', '02/13/2014', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 4, null),
  (DEFAULT, 'disaster', '02/13/2014', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 5, null);;

# --- !Downs

TRUNCATE events CASCADE;;
ALTER SEQUENCE events_event_id_seq RESTART WITH 1;;

TRUNCATE reqs CASCADE;;
ALTER SEQUENCE reqs_req_id_seq RESTART WITH 1;;

TRUNCATE users CASCADE;;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;;

TRUNCATE lgus CASCADE;;

TRUNCATE gov_units CASCADE;;
ALTER SEQUENCE gov_units_gov_unit_id_seq RESTART WITH 1;;

TRUNCATE roles CASCADE;;
