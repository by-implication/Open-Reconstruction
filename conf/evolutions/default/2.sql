# --- many of the inserts here are generated from the csvParser view

# --- !Ups

CREATE EXTENSION IF NOT EXISTS pgcrypto;;

CREATE TABLE roles (
    role_id serial PRIMARY KEY,
    role_name text NOT NULL,
    role_permissions int[] NOT NULL
);;

INSERT INTO roles VALUES
	(1, 'LGU', '{1}'),
	(2, 'OCD', '{2, 3, 5}'),
    (3, 'OP', '{5}'),
	(4, 'DPWH', '{1, 2, 3, 4, 5}'),
	(5, 'DBM', '{1, 5, 6}'),
    (6, 'NGA', '{1, 4}');;

CREATE TABLE agencys (
	agency_id serial PRIMARY KEY,
	agency_name text NOT NULL,
    agency_acronym text,
    role_id int NOT NULL REFERENCES roles
);;

INSERT INTO agencys VALUES
    (1, 'Barangay San Miguel', null, 1),
    (2, 'Office of Civil Defense', 'OCD', 2),
    (3, 'Office of the President', 'OP', 3),
    (4, 'Department of Public Works and Highways', 'DPWH', 4),
    (5, 'Department of Budget and Management', 'DBM', 5),
    (6, 'LOCAL WATER UTILITIES ADMINISTRATION', 'LWUA', 6),
    (7, 'SAN ISIDRO, LEYTE', null, 1),
    (8, 'SAN ROQUE, NORTHERN SAMAR', null, 1),
    (9, 'PIAT, CAGAYAN', null, 1),
    (10, 'ZAMBALES', null, 1),
    (11, 'DPWH REGION 10', 'DPWH', 6),
    (12, 'VINTAR, ILOCOS NORTE', null, 1),
    (13, 'LIBONA, BUKIDNON', null, 1),
    (14, 'AMPATUAN, MAGUINDANAO', null, 1),
    (15, 'SEN SALIPADA K PENDATUN, MAGUINDANAO', null, 1),
    (16, 'ANGONO, RIZAL', 'DPWH', 1),
    (17, 'POLA, ORIENTAL MINDORO', null, 1),
    (18, 'SAN MARCELINO, ZAMBALES', null, 1),
    (19, 'BOSTON, DAVAO ORIENTAL', null, 1),
    (20, 'PRESENTACION, CAMARINES SUR', null, 1),
    (21, 'SUBIC, ZAMBALES', null, 1),
    (22, 'DPWH ROMBLON', 'DPWH', 6),
    (23, 'CHED', 'CHED', 6),
    (24, 'DPWH CARAGA REGION', 'DPWH', 6),
    (25, 'CATANDUANES, LONE DISTRICT', null, 1),
    (26, 'DUMANGAS, ILOILO', null, 1),
    (27, 'MATUNGAO, LANAO DEL NORTE', null, 1),
    (28, 'BUTUAN CITY, AGUSAN DEL NORTE', null, 1),
    (29, 'BRGY ALEJAWAN, JAGNA, BOHOL', null, 1),
    (30, 'BRGY CANTAGAY, JAGNA, BOHOL', null, 1),
    (31, 'SAN RICARDO, SOUTHERN LEYTE', null, 1),
    (32, 'LUBANG, OCCIDENTAL MINDORO', 'DPWH', 1),
    (33, 'DPWH PANGASINAN 4TH DEO', 'DPWH', 6),
    (34, 'DPWH ILOCOS NORTE 2ND DEO', 'DPWH', 6),
    (35, 'DPWH ISABELA 4TH DEO', 'DPWH', 6),
    (36, 'LA UNION', null, 1),
    (37, 'DPWH CEBU 1ST DEO', 'DPWH', 6),
    (38, 'NIA - DAVAO DEL NORTE', 'DPWH', 6),
    (39, 'NIA - LUPON, DAVAO ORIENTAL', 'DPWH', 6),
    (40, 'ALICIA, ZAMBOANGA SIBUGAY', null, 1),
    (41, 'NIA - ALBAY', 'DPWH', 6),
    (42, 'DPWH REGION 3', 'DPWH', 6),
    (43, 'COMPOSTELA VALLEY 1ST DISTRICT', null, 1),
    (44, 'PILAR, ABRA', null, 1),
    (45, 'LIAN, BATANGAS', null, 1),
    (46, 'NASUGBU, BATANGAS', null, 1),
    (47, 'TRENTO, AGUSAN DEL SUR', null, 1),
    (48, 'CANDABA, PAMPANGA', null, 1),
    (49, 'VIGA, CATANDUANES', null, 1),
    (50, 'MADELLA, QUIRINO', null, 1),
    (51, 'ORIENTAL MINDORO', null, 1),
    (52, 'STA MARIA, DAVAO DEL SUR', null, 1),
    (53, 'STA MAGDALENA, SORSOGON', null, 1),
    (54, 'DOLORES, ABRA', null, 1),
    (55, 'BRGY PRESIDENT ROXAS, CAPIZ', null, 1),
    (56, 'DPWH 3RD ILOILO DEO', 'DPWH', 6),
    (57, 'DPWH NUEVA ECIJA 2ND DEO', 'DPWH', 6),
    (58, 'ADAMS, ILOCOS NORTE', null, 1),
    (59, 'SAN FABIAN, PANGASINAN', null, 1),
    (60, 'SUAL, PANGASINAN', null, 1);;

CREATE TABLE municipalitys (
    municipality_id serial PRIMARY KEY REFERENCES agencys(agency_id),
    municipality_nthClass int NOT NULL
);;

INSERT INTO municipalitys VALUES
    (20, 4),
    (49, 4),
    (58, 5),
    (59, 1);;

CREATE TABLE users (
    user_id serial PRIMARY KEY,
    user_handle text NOT NULL,
    user_name text,
    user_password text NOT NULL,
    agency_id int NOT NULL REFERENCES agencys,
    user_admin boolean NOT NULL DEFAULT false
);;

INSERT INTO users VALUES
    (1, 'brgyoza', 'Brenda Repolyo Gyoza', crypt('password', gen_salt('bf')), 1, true),
    (2, 'ocdeguzman', 'Oscar Clamidio De Guzman', crypt('password', gen_salt('bf')), 2, true),
    (3, 'bsaquinoiii', 'Benigno S. Aquino III', crypt('password', gen_salt('bf')), 3, true),
    (4, 'dpwhereford', 'David Pena Whereford', crypt('password', gen_salt('bf')), 4, true),
    (5, 'dbmoya', 'Dersecretary Bon Moya', crypt('password', gen_salt('bf')), 5, true),
    (6, 'rcvilla', 'Chairman Rene C. Villa', crypt('password', gen_salt('bf')), 6, false),
    (7, 'syang', 'Mayor Suasan Yap Ang', crypt('password', gen_salt('bf')), 7, false),
    (8, 'dlabalon', 'Mayor Don L. Abalon', crypt('password', gen_salt('bf')), 8, false),
    (9, 'rcvillacete', 'Mayor R. Carmelo O. Villacete', crypt('password', gen_salt('bf')), 9, false),
    (10, 'mrcoady', 'Ms. Ma Remedios Bueno Coady', crypt('password', gen_salt('bf')), 10, false),
    (11, 'rlsingson', 'Sec. Rogelio L. Singson', crypt('password', gen_salt('bf')), 11, false),
    (12, 'jgforonda', 'Mayor Jose G. Foronda', crypt('password', gen_salt('bf')), 12, false),
    (13, 'lgcalinggasan', 'Mayor Leanardo Genesis T. Calinggasan', crypt('password', gen_salt('bf')), 13, false),
    (14, 'drsangki', 'Mayor Datu Rasul M. Sangki', crypt('password', gen_salt('bf')), 14, false),
    (15, 'skpendatun', 'Mayor Sahjid Khan P. Pendatun', crypt('password', gen_salt('bf')), 15, false),
    (16, 'gvcalderon', 'Mayor Gerardo V. Calderon', crypt('password', gen_salt('bf')), 16, false),
    (17, 'lppanganiban', 'Mayor Leandro P. Panganiban Jr', crypt('password', gen_salt('bf')), 17, false),
    (18, 'jfrodriguez', 'Mayor Jose F. Rodriguez', crypt('password', gen_salt('bf')), 18, false),
    (19, 'rbrosit', 'Mayor Rebecca B. Rosit Sr', crypt('password', gen_salt('bf')), 19, false),
    (20, 'jvdelena', 'Mayor Jimmy V. Delena', crypt('password', gen_salt('bf')), 20, false),
    (21, 'jfkhonghun', 'Mayor Jefferson F. Khonghun', crypt('password', gen_salt('bf')), 21, false),
    (22, 'cplicuanan', 'Chairperson Patricia B. Licuanan', crypt('password', gen_salt('bf')), 23, false),
    (23, 'cvsarmiento', 'Cong. Cesar V. Sarmiento', crypt('password', gen_salt('bf')), 25, false),
    (24, 'rbdistura', 'Mayor Rolando B. Distura', crypt('password', gen_salt('bf')), 26, false),
    (25, 'aaazis', 'Mayor Aisha A. Azis', crypt('password', gen_salt('bf')), 27, false),
    (26, 'fmamante', 'Mayor Ferdinand M. Amante Jr', crypt('password', gen_salt('bf')), 28, false),
    (27, 'ttrana', 'Brgy. Captain Teofilo T. Rana', crypt('password', gen_salt('bf')), 29, false),
    (28, 'jorosario', 'Brgy. Captain Joel O. Rosario', crypt('password', gen_salt('bf')), 30, false),
    (29, 'wgyu', 'Mayor William G. Yu', crypt('password', gen_salt('bf')), 31, false),
    (30, 'jmsanchez', 'Mayor Juan M. Sanchez', crypt('password', gen_salt('bf')), 32, false),
    (31, 'mcortega', 'Gov. Manuel C. Ortega', crypt('password', gen_salt('bf')), 36, false),
    (32, 'rsmomo', 'Usec. Romeo S. Momo', crypt('password', gen_salt('bf')), 38, false),
    (33, 'ysmusa', 'Mayor Yashier S. Musa', crypt('password', gen_salt('bf')), 40, false),
    (34, 'mczamora', 'Cong. Maria Carmen Zamora', crypt('password', gen_salt('bf')), 43, false),
    (35, 'jjdisono', 'Mayor Jaja Josefina S. Disono', crypt('password', gen_salt('bf')), 44, false),
    (36, 'iibolompo', 'Mayor Isagani I. Bolompo', crypt('password', gen_salt('bf')), 45, false),
    (37, 'raapacible', 'Mayor Rosario Apacible', crypt('password', gen_salt('bf')), 46, false),
    (38, 'jcbillanes', 'Mayor Johnmark C. Billanes', crypt('password', gen_salt('bf')), 47, false),
    (39, 'remaglanque', 'Mayor Rene E. Maglanque', crypt('password', gen_salt('bf')), 48, false),
    (40, 'gsolfindo', 'Mayor Gordon S. Olfindo', crypt('password', gen_salt('bf')), 49, false),
    (41, 'rgylanan', 'Mayor Renato G. Ylanan', crypt('password', gen_salt('bf')), 50, false),
    (42, 'avumali', 'Gov. Alfonso V. Umali Jr', crypt('password', gen_salt('bf')), 51, false),
    (43, 'gpmariscal', 'Mayor George P. Mariscal', crypt('password', gen_salt('bf')), 52, false),
    (44, 'jbgallanosa', 'Mayor Jocelyn B. Gallanosa', crypt('password', gen_salt('bf')), 53, false),
    (45, 'rvseares', 'Mayor Robert V. Seares Jr', crypt('password', gen_salt('bf')), 54, false),
    (46, 'fbbereber', 'Ms. Felicitas Bereber', crypt('password', gen_salt('bf')), 55, false),
    (47, 'etbawigan', 'Mayor Eric T. Bawigan', crypt('password', gen_salt('bf')), 58, false),
    (48, 'vgdolor', 'Vice Governor Humerlito A. Dolor', crypt('password', gen_salt('bf')), 46, false),
    (49, 'cbagbayani', 'Mayor Constante B. Agbayani', crypt('password', gen_salt('bf')), 59, false),
    (50, 'rlarcinue', 'Mayor Roberto Li Arcinue', crypt('password', gen_salt('bf')), 60, false);

# --- !Downs

DROP TABLE IF EXISTS users;;

DROP TABLE IF EXISTS municipalitys;;

DROP TABLE IF EXISTS agencys;;

DROP TABLE IF EXISTS roles;;

DROP EXTENSION IF EXISTS pgcrypto;;
