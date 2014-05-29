# --- !Ups

SET datestyle = "ISO, MDY";

INSERT INTO roles VALUES
    (1, 'LGU', '{1}'),
    (2, 'OCD', '{3, 5}'),
    (3, 'OP', '{5}'),
    (4, 'DPWH', '{1, 2, 3, 4, 5}'),
    (5, 'DBM', '{1, 5, 6}'),
    (6, 'NGA', '{1, 4}');;

INSERT INTO gov_units VALUES
    (DEFAULT, 'Barangay San Miguel', null, 1),
    (DEFAULT, 'Office of Civil Defense', 'OCD', 2),
    (DEFAULT, 'Office of the President', 'OP', 3),
    (DEFAULT, 'Department of Public Works and Highways', 'DPWH', 4),
    (DEFAULT, 'Department of Budget and Management', 'DBM', 5),
--generated by csvParser.js
(DEFAULT, 'LOCAL WATER UTILITIES ADMINISTRATION', 'LWUA', 6),
(DEFAULT, 'SAN ISIDRO, LEYTE', null, 1),
(DEFAULT, 'SAN ROQUE, NORTHERN SAMAR', null, 1),
(DEFAULT, 'PIAT, CAGAYAN', null, 1),
(DEFAULT, 'ZAMBALES', null, 1),
(DEFAULT, 'DPWH REGION 10', 'DPWH', 6),
(DEFAULT, 'VINTAR, ILOCOS NORTE', null, 1),
(DEFAULT, 'LIBONA, BUKIDNON', null, 1),
(DEFAULT, 'AMPATUAN, MAGUINDANAO', null, 1),
(DEFAULT, 'SEN SALIPADA K PENDATUN, MAGUINDANAO', null, 1),
(DEFAULT, 'ANGONO, RIZAL', null, 1),
(DEFAULT, 'POLA, ORIENTAL MINDORO', null, 1),
(DEFAULT, 'SAN MARCELINO, ZAMBALES', null, 1),
(DEFAULT, 'BOSTON, DAVAO ORIENTAL', null, 1),
(DEFAULT, 'PRESENTACION, CAMARINES SUR', null, 1),
(DEFAULT, 'SUBIC, ZAMBALES', null, 1),
(DEFAULT, 'DPWH ROMBLON', 'DPWH', 6),
(DEFAULT, 'CHED', 'CHED', 6),
(DEFAULT, 'DPWH CARAGA REGION', 'DPWH', 6),
(DEFAULT, 'CATANDUANES, LONE DISTRICT', null, 1),
(DEFAULT, 'DUMANGAS, ILOILO', null, 1),
(DEFAULT, 'MATUNGAO, LANAO DEL NORTE', null, 1),
(DEFAULT, 'BUTUAN CITY, AGUSAN DEL NORTE', null, 1),
(DEFAULT, 'BRGY ALEJAWAN, JAGNA, BOHOL', null, 1),
(DEFAULT, 'BRGY CANTAGAY, JAGNA, BOHOL', null, 1),
(DEFAULT, 'SAN RICARDO, SOUTHERN LEYTE', null, 1),
(DEFAULT, 'LUBANG, OCCIDENTAL MINDORO', null, 1),
(DEFAULT, 'DPWH PANGASINAN 4TH DEO', 'DPWH', 6),
(DEFAULT, 'DPWH ILOCOS NORTE 2ND DEO', 'DPWH', 6),
(DEFAULT, 'DPWH ISABELA 4TH DEO', 'DPWH', 6),
(DEFAULT, 'LA UNION', null, 1),
(DEFAULT, 'DPWH CEBU 1ST DEO', 'DPWH', 6),
(DEFAULT, 'NIA - DAVAO DEL NORTE', 'DPWH', 6),
(DEFAULT, 'NIA - LUPON, DAVAO ORIENTAL', 'DPWH', 6),
(DEFAULT, 'ALICIA, ZAMBOANGA SIBUGAY', null, 1),
(DEFAULT, 'NIA - ALBAY', 'DPWH', 6),
(DEFAULT, 'DPWH REGION 3', 'DPWH', 6),
(DEFAULT, 'COMPOSTELA VALLEY 1ST DISTRICT', null, 1),
(DEFAULT, 'PILAR, ABRA', null, 1),
(DEFAULT, 'LIAN, BATANGAS', null, 1),
(DEFAULT, 'NASUGBU, BATANGAS', null, 1),
(DEFAULT, 'TRENTO, AGUSAN DEL SUR', null, 1),
(DEFAULT, 'CANDABA, PAMPANGA', null, 1),
(DEFAULT, 'VIGA, CATANDUANES', null, 1),
(DEFAULT, 'MADELLA, QUIRINO', null, 1),
(DEFAULT, 'ORIENTAL MINDORO', null, 1),
(DEFAULT, 'STA MARIA, DAVAO DEL SUR', null, 1),
(DEFAULT, 'STA MAGDALENA, SORSOGON', null, 1),
(DEFAULT, 'DOLORES, ABRA', null, 1),
(DEFAULT, 'BRGY PRESIDENT ROXAS, CAPIZ', null, 1),
(DEFAULT, 'DPWH 3RD ILOILO DEO', 'DPWH', 6),
(DEFAULT, 'DPWH NUEVA ECIJA 2ND DEO', 'DPWH', 6),
(DEFAULT, 'ADAMS, ILOCOS NORTE', null, 1),
(DEFAULT, 'SAN FABIAN, PANGASINAN', null, 1),
(DEFAULT, 'SUAL, PANGASINAN', null, 1);;

COPY gov_units FROM 'gov_units.csv' CSV ENCODING 'ISO_8859_9';;

COPY lgus FROM 'lgus.csv' CSV;;

--generated by csvParser.js
-- INSERT INTO municipalitys VALUES
-- (20, 4),
-- (49, 4),
-- (58, 5),
-- (59, 1);;

INSERT INTO users VALUES
    (DEFAULT, 'brgyoza', 'Brenda Repolyo Gyoza', crypt('password', gen_salt('bf')), 1, true),
    (DEFAULT, 'ocdeguzman', 'Oscar Clamidio De Guzman', crypt('password', gen_salt('bf')), 2, true),
    (DEFAULT, 'bsaquinoiii', 'Benigno S. Aquino III', crypt('password', gen_salt('bf')), 3, true),
    (DEFAULT, 'dpwhereford', 'David Pena Whereford', crypt('password', gen_salt('bf')), 4, true),
    (DEFAULT, 'dbmoya', 'Dersecretary Bon Moya', crypt('password', gen_salt('bf')), 5, true),
--generated by csvParser.js
(DEFAULT, 'rcvilla', 'Chairman Rene C. Villa', crypt('password', gen_salt('bf')), 6, false),
(DEFAULT, 'syang', 'Mayor Suasan Yap Ang', crypt('password', gen_salt('bf')), 7, false),
(DEFAULT, 'dlabalon', 'Mayor Don L. Abalon', crypt('password', gen_salt('bf')), 8, false),
(DEFAULT, 'rcvillacete', 'Mayor R. Carmelo O. Villacete', crypt('password', gen_salt('bf')), 9, false),
(DEFAULT, 'mrcoady', 'Ms. Ma Remedios Bueno Coady', crypt('password', gen_salt('bf')), 10, false),
(DEFAULT, 'rlsingson', 'Sec. Rogelio L. Singson', crypt('password', gen_salt('bf')), 11, false),
(DEFAULT, 'jgforonda', 'Mayor Jose G. Foronda', crypt('password', gen_salt('bf')), 12, false),
(DEFAULT, 'lgcalinggasan', 'Mayor Leanardo Genesis T. Calinggasan', crypt('password', gen_salt('bf')), 13, false),
(DEFAULT, 'drsangki', 'Mayor Datu Rasul M. Sangki', crypt('password', gen_salt('bf')), 14, false),
(DEFAULT, 'skpendatun', 'Mayor Sahjid Khan P. Pendatun', crypt('password', gen_salt('bf')), 15, false),
(DEFAULT, 'gvcalderon', 'Mayor Gerardo V. Calderon', crypt('password', gen_salt('bf')), 16, false),
(DEFAULT, 'lppanganiban', 'Mayor Leandro P. Panganiban Jr', crypt('password', gen_salt('bf')), 17, false),
(DEFAULT, 'jfrodriguez', 'Mayor Jose F. Rodriguez', crypt('password', gen_salt('bf')), 18, false),
(DEFAULT, 'rbrosit', 'Mayor Rebecca B. Rosit Sr', crypt('password', gen_salt('bf')), 19, false),
(DEFAULT, 'jvdelena', 'Mayor Jimmy V. Delena', crypt('password', gen_salt('bf')), 20, false),
(DEFAULT, 'jfkhonghun', 'Mayor Jefferson F. Khonghun', crypt('password', gen_salt('bf')), 21, false),
(DEFAULT, 'cplicuanan', 'Chairperson Patricia B. Licuanan', crypt('password', gen_salt('bf')), 23, false),
(DEFAULT, 'cvsarmiento', 'Cong. Cesar V. Sarmiento', crypt('password', gen_salt('bf')), 25, false),
(DEFAULT, 'rbdistura', 'Mayor Rolando B. Distura', crypt('password', gen_salt('bf')), 26, false),
(DEFAULT, 'aaazis', 'Mayor Aisha A. Azis', crypt('password', gen_salt('bf')), 27, false),
(DEFAULT, 'fmamante', 'Mayor Ferdinand M. Amante Jr', crypt('password', gen_salt('bf')), 28, false),
(DEFAULT, 'ttrana', 'Brgy. Captain Teofilo T. Rana', crypt('password', gen_salt('bf')), 29, false),
(DEFAULT, 'jorosario', 'Brgy. Captain Joel O. Rosario', crypt('password', gen_salt('bf')), 30, false),
(DEFAULT, 'wgyu', 'Mayor William G. Yu', crypt('password', gen_salt('bf')), 31, false),
(DEFAULT, 'jmsanchez', 'Mayor Juan M. Sanchez', crypt('password', gen_salt('bf')), 32, false),
(DEFAULT, 'mcortega', 'Gov. Manuel C. Ortega', crypt('password', gen_salt('bf')), 36, false),
(DEFAULT, 'rsmomo', 'Usec. Romeo S. Momo', crypt('password', gen_salt('bf')), 38, false),
(DEFAULT, 'ysmusa', 'Mayor Yashier S. Musa', crypt('password', gen_salt('bf')), 40, false),
(DEFAULT, 'mczamora', 'Cong. Maria Carmen Zamora', crypt('password', gen_salt('bf')), 43, false),
(DEFAULT, 'jjdisono', 'Mayor Jaja Josefina S. Disono', crypt('password', gen_salt('bf')), 44, false),
(DEFAULT, 'iibolompo', 'Mayor Isagani I. Bolompo', crypt('password', gen_salt('bf')), 45, false),
(DEFAULT, 'raapacible', 'Mayor Rosario Apacible', crypt('password', gen_salt('bf')), 46, false),
(DEFAULT, 'jcbillanes', 'Mayor Johnmark C. Billanes', crypt('password', gen_salt('bf')), 47, false),
(DEFAULT, 'remaglanque', 'Mayor Rene E. Maglanque', crypt('password', gen_salt('bf')), 48, false),
(DEFAULT, 'gsolfindo', 'Mayor Gordon S. Olfindo', crypt('password', gen_salt('bf')), 49, false),
(DEFAULT, 'rgylanan', 'Mayor Renato G. Ylanan', crypt('password', gen_salt('bf')), 50, false),
(DEFAULT, 'avumali', 'Gov. Alfonso V. Umali Jr', crypt('password', gen_salt('bf')), 51, false),
(DEFAULT, 'gpmariscal', 'Mayor George P. Mariscal', crypt('password', gen_salt('bf')), 52, false),
(DEFAULT, 'jbgallanosa', 'Mayor Jocelyn B. Gallanosa', crypt('password', gen_salt('bf')), 53, false),
(DEFAULT, 'rvseares', 'Mayor Robert V. Seares Jr', crypt('password', gen_salt('bf')), 54, false),
(DEFAULT, 'fbbereber', 'Ms. Felicitas Bereber', crypt('password', gen_salt('bf')), 55, false),
(DEFAULT, 'etbawigan', 'Mayor Eric T. Bawigan', crypt('password', gen_salt('bf')), 58, false),
(DEFAULT, 'vgdolor', 'Vice Governor Humerlito A. Dolor', crypt('password', gen_salt('bf')), 51, false),
(DEFAULT, 'cbagbayani', 'Mayor Constante B. Agbayani', crypt('password', gen_salt('bf')), 59, false),
(DEFAULT, 'rlarcinue', 'Mayor Roberto Li Arcinue', crypt('password', gen_salt('bf')), 60, false);;

--generated by csvParser.js
INSERT INTO reqs (req_description, project_type_id, req_amount, req_date, author_id, req_location, req_disaster_date, req_disaster_name) VALUES
('REPAIR/REHABILITATION OF WATER SUPPLY SYSTEMS IN CAPIZ AND ILOILO', 14, 7337329.40, '11/28/2013', 6, 'Region 6', '11/28/2013', 'T QUINTA IN 2012'),
('REHABILITATION OF DIPACULAO WATER DISTRICT ', 14, 1200000.00, '12/10/2013', 6, 'DIPACULAO, AURORA, Region 3', '12/10/2013', 'T LABUYO IN AUGUST 2013'),
('REHABILITATION OF INFRASTRUCTURE PROJECT', 15, 0.00, '11/22/2013', 7, 'SAN ISIDRO, LEYTE, Region 8', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REHABILITATION OF INFRASTRUCTURE PROJECT', 15, 0.00, '11/22/2013', 8, 'SAN ROQUE, NORTHERN SAMAR, Region 8', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013'),
('FINANCIAL ASSISTANCE ', 5, 0.00, '11/18/2013', 9, 'PIAT, CAGAYAN, Region 2', '11/18/2013', 'T VINTA IN 2013'),
('IMPROVEMENT/REHABILITATION OF SLOPE PROTECTION WORKS OF THE ROSABAN-POONBATO-BELBEL AND POONBATO-LIGLIG ROADS', 11, 0.00, '11/27/2013', 10, 'ZAMBALES, Region 3', '11/27/2013', ''),
('RECONSTRUCTION/REPLACEMENT OF FLOOD CONTROL WORKS AND DRAINAGE STRUCTURES', 15, 137107000.00, '12/09/2013', 11, 'Region 10', '12/09/2013', 'TS SENDONG 2011'),
('REPAIR OF THE PORTION OF THE VINTAR FLOOD CONTROL STRUCTURE (DIKE) LOCATED AT BARANGAY #5', 6, 104819000.00, '12/09/2013', 12, 'VINTAR, ILOCOS NORTE, Region 1', '12/09/2013', 'T ODETTE IN 2013'),
('CONCRETING OF ACCESS ROAD AND CONSTRUCTION OF DRAINAGE SYSTEM (LEADING TO PAGLAUM RESETTLEMENT AREA), BRGY POBLACION', 11, 7900000.00, '12/26/2013', 13, 'LIBONA, BUKIDNON, Region 10', '12/26/2013', 'TS SENDONG 2011'),
('REPAIR/REHABILITATION OF BARANGAY ROADS ', 11, 8000000.00, '09/25/2013', 14, 'AMPATUAN, MAGUINDANAO, Region 16', '09/25/2013', 'FLASHFLOOD IN JULY 2013'),
('REPAIR/REHABILITATION OF BARANGAY ROADS ', 11, 29000000.00, '09/25/2013', 15, 'GEN SALIPADA PENDATUN, MAGUINDANAO, Region 16', '09/25/2013', 'MONSOON RAINS IN 2012'),
('IMPROVEMENT/CONSTRUCTION O GRAVITY WALL WITH GABIONS AS FOUNDATION ALONG AGONON RIVER AT INTERMITITTENT SECTION FRON STA. 0+700-STA. 7+000, ANGONO, RIZAL', 15, 27779000.00, '02/13/2014', 16, 'ANGONO, RIZAL, Region 4', '02/13/2014', 'HABAGAT & T MARING - AUGUST 18-20, 2013'),
('CONSTRUCTION/IMPROVEMENT OF POLA RIVER CONTROL AND SEAWALL (PHASE 4)', 9, 9500000.00, '02/24/2014', 17, 'POLA, ORIENTAL MINDORO, Region 4', '02/24/2014', ''),
('REPAIR/REHABILITATION OF FARM-TO-MARKETS, BRGY AGLAW AND BUHAWEN TO PROVINCIAL ROAD NETWORK, SAN MARCELINO, ZAMBALES', 11, 10000000.00, '02/24/2014', 18, 'SAN MARCELINO, ZAMBALES, Region 3', '02/24/2014', 'T ODETTE IN 2013'),
('CONSTRUCTION OF ROADS', 11, 22873954.52, '02/24/2014', 19, 'BOSTON, DAVAO ORIENTAL, Region 11', '02/24/2014', ''),
('REHABILITATION/CONSTRUCTION OF BARANGAY ROADS', 11, 50000000.00, '02/24/2014', 20, 'PRESENTACION, CAMARINES SUR, Region 5', '02/24/2014', ''),
('DESILTING OF RIVERS', 10, 0.00, '02/24/2014', 21, 'SUBIC, ZAMBALES, Region 3', '02/24/2014', 'HABAGAT - SEPT 2013'),
('CONSTRUCTION OF RIVER CONTROL PROJECTS IN THE PROVINCE OF ROMBLON', 9, 226219000.00, '02/24/2014', 11, 'ROMBLON, Region 4', '02/24/2014', 'T YOLONDA - 2013'),
('RECONSTRUCTION OF FLOOD CONTROL ALONG IPONAN RIVER, CAGAYAN DE ORO CITY AND MANDULOG RIVER, ILIGAN CITY', 9, 248363075.00, '02/13/2014', 11, 'Region 10', '02/13/2014', 'T SENDONG - 2011'),
('REPAIR/REHABILITATION OF SUCS BUILDINGS AND FACILITIES', 12, 4101042105.00, '02/14/2014', 22, '', '02/14/2014', 'T LABUYO, ODETTE, PABLO, SANTI, SENDONG, VINTA, YOLANDA, ZAMBOANGA SEIGE, AND CEBU & BOHOL EARTHQUAKE'),
('CONSTRUCTION OF FLOOD CONTROL ALONG ILIGAN AND PUGA-AN RIVERS', 6, 3620000.00, '02/13/2014', 11, 'ILIGAN CITY, LANAO DEL NORTE, Region 10', '02/13/2014', 'T SENDONG - 2011'),
('REPAIR/RESTORATION OF INFRASTRUCTURE PROJECTS IN THE PROVINCE OF SURIGAO DEL NORTE AND DINAGAT ISLAND', 15, 2755000.00, '02/13/2014', 11, 'Region 13', '02/13/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 66819000.00, '01/21/2014', 23, 'CATANDUANES, Region 5', '01/21/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 89000000.00, '05/15/2013', 24, 'DUMANGAS, ILOILO, Region 6', '05/15/2013', 'T QUINTA - 2012'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 39750000.00, '02/20/2014', 8, 'SAN ROQUE, NORTHERN SAMAR, Region 8', '02/20/2014', 'T AGATON IN 2013'),
('REPAIR/REHABILITATION OF WATER SYSTEM AND BAILEY BRIDGE IN MATUNGAO', 15, 0.00, '02/20/2014', 25, 'MATUNGAO, LANAO DEL NORTE, Region 10', '02/20/2014', 'T AGATON IN 2013'),
('DESILTING OF THE AGUSAN RIVER', 15, 7500000.00, '02/18/2014', 26, 'BUTUAN CITY, AGUSAN DEL NORTE, Region 13', '02/18/2014', 'T AGATON IN 2013'),
('CONSTRUCTION OF SEAWALL ALONG COAST LINE OF ALEJAWAN BRGY ROAD', 13, 2000000.00, '02/14/2014', 27, 'ALEJAWAN, JAGNA, BOHOL, Region 7', '02/14/2014', ''),
('PURCHASE OF DISASTER EQUIPMENT', 3, 1000000.00, '02/14/2014', 28, 'CANTAGAY, JAGNA, BOHOL, Region 7', '02/14/2014', ''),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 18560112.00, '02/14/2014', 29, 'SAN RICARDO, SOUTHERN LEYTE, Region 8', '02/14/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('RECONSTRUCTION/REHABILITATION OF POBLACION WEST SEAWALL, LUBANG, OCCIDENTAL MINDORO', 13, 17000000.00, '02/13/2014', 30, 'LUBANG, OCCIDENTAL MINDORO, Region 4', '02/13/2014', 'T GENER, OFEL, PABLO IN 2012'),
('REPAIR/REHABILITATION OF ROADS', 11, 2809000.00, '02/13/2014', 11, 'PANGASINAN, Region 1', '02/13/2014', 'T LABUYO, MARING & HABAGAT IN 2013'),
('CONSTRUCTION/REPAIR/REHABILITATION OF FLOOD CONTROL PROJECTS', 6, 139736000.00, '02/13/2014', 11, 'ILOCOS NORTE, Region 1', '02/13/2014', 'T ODETTE IN 2013'),
('REPAIR/REHABILITATION OF FLOOD CONTROL PROEJCTS ALONG CAGAYAN RIVER', 6, 11371000.00, '02/13/2014', 11, 'ISABELA, Region 2', '02/13/2014', 'T LABUYO IN 2013'),
('REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 75000000.00, '02/07/2014', 31, 'CABA, LA UNION, Region 1', '02/07/2014', 'T LABUYO & MARING IN 2013'),
('CONSTRUCTION OF FLOOD CONTROL/DRAINAGE FACILITIES ALONG CEBU NORTH HAGNAYA WHARF ROAD & BOGO-CURVA-MEDELLIN-DAANBANTAYAN ROAD', 15, 63000000.00, '02/04/2014', 11, 'CEBU, Region 7', '02/04/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REPAIR/REHABILITATION OF IRRIGATION FACILITIES', 8, 49500000.00, '02/03/2014', 32, 'DAVAO DEL NORTE, Region 11', '02/03/2014', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012'),
('REPAIR/REHABILITATION OF IRRIGATION FACILITIES IN LUPON, DAVAO ORIENTAL', 8, 1000000.00, '01/21/2014', 32, 'LUPON, DAVAO ORIENTAL, Region 11', '01/21/2014', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012'),
('CONSTRUCTION OF MDMO ', 2, 2500000.00, '02/13/2014', 33, 'ALICIA, ZAMBOANGA SIBUGAY, Region 9', '02/13/2014', ''),
('REPAIR/REHABILITATION OF IRRIGATION FACILITIES IN ALBAY', 8, 3005000.00, '12/10/2013', 32, 'ALBAY, Region 5', '12/10/2013', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 196422363.89, '02/05/2014', 11, 'Region 3', '02/05/2014', 'T SANTI - 2013'),
('REPAIR/REHABILITATION OF ILOCOS NORTE-APAYAO ROAD', 11, 10000000.00, '01/15/2014', 11, 'SOLSONA, ILOCOS NORTE, Region 1', '01/15/2014', 'T ODETTE IN 2013'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS IN THE 1ST DISTRICT OF COMPOSTELA VALLEY', 15, 122130000.00, '01/13/2013', 34, 'COMPOSTELA VALLEY, Region 11', '01/13/2013', 'T PABLO - 2012'),
('REHABILITATION/IMPROVEMENT OF FARM-TO-MARKET ROAD', 11, 10000000.00, '10/17/2013', 35, 'PILAR, ABRA, Region 15', '10/17/2013', 'T PABLO - 2012'),
('CONSTRUCTION OF FARM-TO-MARKET ROADS IN 10 BARANGAYS', 11, 20000000.00, '02/04/2014', 36, 'LIAN, BATANGAS, Region 4', '02/04/2014', ''),
('CONSTRUCTION OF FARM-TO-MARKET ROADS AT DAYAP-PUTAT-BUNDUCAN-UTOD SECTION', 11, 31000000.00, '02/03/2014', 37, 'NASUGBU, BATANGAS, Region 4', '02/03/2014', ''),
('CONSTRUCTION OF FARM-TO-MARKET ROADS IN CATANDAAN-MAUGAT SECTION', 11, 17000000.00, '02/03/2014', 37, 'NASUGBU, BATANGAS, Region 4', '02/03/2014', ''),
('REHABILITATION OF SITIO GASA-BAGONG SILANG - CUEVAS FARM-TO-MARKET ROAD AND NRJ POBLACION - SITIO GASA - TUDELA FMR', 11, 100000000.00, '02/03/2014', 38, 'TRENTO, AGUSAN DEL SUR, Region 13', '02/03/2014', 'T PABLO - 2012'),
('REHABILITATION AND UPGRADING OF THE POBLACION ROAD', 11, 10000000.00, '01/16/2014', 39, 'CANDABA, PAMPANGA, Region 3', '01/16/2014', 'FLOODING'),
('CONSTRUCTION OF RIVER FLOOD CONTROL PROJECTS IN VIGA, CATANDUANES', 6, 45000000.00, '01/07/2014', 40, 'VIGA, CATANDUANES, Region 5', '01/07/2014', ''),
('REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 12782666.00, '01/07/2014', 41, 'MADELLA, QUIRINO, Region 2', '01/07/2014', 'T LABUYO - 2013'),
('RECONSTRUCTION/REHABILITATION OF RIVER CONTROL PROJECTS', 6, 70000000.00, '01/17/2014', 42, 'CALAPAN, ORIENTAL MINDORO, Region 4', '01/17/2014', ''),
('CONSTRUCTION OF FLOOD CONTROL STRUCTUREE IN BARANGAY PONGPONG', 6, 5435903.00, '01/22/2014', 43, 'STA MARIA, DAVAO DEL SUR, Region 11', '01/22/2014', ''),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 15, 160000000.00, '01/22/2014', 44, 'STA MAGDALENA, SORSOGON, Region 5', '01/22/2014', 'T REMING & MILENYO'),
('CONSTRUCTION OF FLOOD CONTROL STRUCTURES IN BRGYS CORDONA AND ISIT, DOLORES, ABRA', 6, 30000000.00, '01/22/2014', 45, 'DOLORES, ABRA, Region 15', '01/22/2014', ''),
('FINANCIAL ASSISTANCE FOR THE REPAIR OF HER HOUSE', 7, 0.00, '01/07/2014', 46, 'PRESIDENT ROXAS, CAPIZ, Region 6', '01/07/2014', 'T YOLANDA'),
('REHABILITATION OF ROADS AND BRIDGE', 11, 62073000.00, '02/20/2014', 11, 'ILOILO, Region 6', '02/20/2014', 'T YOLANDA'),
('REPAIR/REHABILITATION OF DIGMALA AND CORONEL RIVER CONTROL STRUCTURES', 9, 55352338.44, '02/28/2014', 11, 'NUEVE ECIJA, Region 3', '02/28/2014', 'T LABUYO - 2013'),
('REHABILITATION OF RIVE CONTROL DIKE IN POBLACION 3', 9, 3800000.00, '02/28/2014', 47, 'ADAMS, ILOCOS NORTE, Region 1', '02/28/2014', 'T VINTA IN 2013'),
('CONSTRUCTION OF RIVER PROTECTION AND GABION DIKES ', 9, 195000000.00, '02/26/2014', 48, 'ORIENTAL MINDORO, Region 4', '02/26/2014', 'T YOLANDA'),
('REHABILITATION OF RIVER BANK, ROADS AND DREDGING OF RIVER BANKS ', 15, 53000000.00, '02/26/2014', 49, 'SAN FABIAN, PANGASINAN, Region 1', '02/26/2014', 'T NANDO, LABUYO & MARING - 2013'),
('1,000 HOUSING UNITS ', 7, 0.00, '01/17/2014', 50, 'SUAL, PANGASINAN, Region 1', '01/17/2014', ''),
('CONSTRUCTION OF EVACUATION CENTER ', 4, 0.00, '01/16/2014', 49, 'SAN FABIAN, PANGASINAN, Region 1', '01/16/2014', '');;

--generated by csvParser.js
INSERT INTO events VALUES
(DEFAULT, 'comment', '01/13/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P7,337,329.40 TO LWUA FOR OP APPROVAL', 1, 2),
(DEFAULT, 'comment', '01/13/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P1.2MILLION TO LWUA FOR OP APPROVAL', 2, 2),
(DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO VIII FOR INCLUSION ON THE PDNA FOR T YOLANDA', 3, 2),
(DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO VIII FOR INCLUSION ON THE PDNA FOR T YOLANDA', 4, 2),
(DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO II FOR APPROPRIATE ACTION', 5, 2),
(DEFAULT, 'comment', '01/29/2014', 'NDRRMC REFERRED SAID REQUEST TO OCDRO 3 FOR APPROPRIATE ACTION ', 6, 2),
(DEFAULT, 'comment', '01/22/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P137.107M CF FOR OP APPROVAL', 7, 2),
(DEFAULT, 'comment', '01/27/2014', 'NDRRMC REFERRED THE REQUEST TO OCDR=O 1 FOR APPROPRIATE ACTION', 8, 2),
(DEFAULT, 'comment', '01/28/2014', 'NDRRMC REFERRED TO DPWH FOR RE-ASSESSMENT AND RECOMMENDATION ', 9, 2),
(DEFAULT, 'comment', '01/28/2014', 'NDRRMC REFERRED TO DPWH FOR RE-ASSESSMENT AND RECOMMENDATION ', 10, 2),
(DEFAULT, 'comment', '01/28/2014', 'NDRRMC REFERRED TO DPWH FOR RE-ASSESSMENT AND RECOMMENDATION ', 11, 2),
(DEFAULT, 'comment', '08/10/2013', 'REFERRED TO DPWH FOR VALIDATION AND RECOMMENDATION', 24, 2),
(DEFAULT, 'comment', '02/27/2014', 'NDRRMC REFERRED TO DSWD FOR APPROPRIATE ACTION', 56, 2),
(DEFAULT, 'comment', '02/20/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P62.073M TO DPWH ILOILO 3RD DEO FOR OP APPROVAL', 57, 2),
(DEFAULT, 'newRequest', '11/28/2013', 'REPAIR/REHABILITATION OF WATER SUPPLY SYSTEMS IN CAPIZ AND ILOILO', 1, 6),
(DEFAULT, 'newRequest', '12/10/2013', 'REHABILITATION OF DIPACULAO WATER DISTRICT ', 2, 6),
(DEFAULT, 'newRequest', '11/22/2013', 'REHABILITATION OF INFRASTRUCTURE PROJECT', 3, 7),
(DEFAULT, 'newRequest', '11/22/2013', 'REHABILITATION OF INFRASTRUCTURE PROJECT', 4, 8),
(DEFAULT, 'newRequest', '11/18/2013', 'FINANCIAL ASSISTANCE ', 5, 9),
(DEFAULT, 'newRequest', '11/27/2013', 'IMPROVEMENT/REHABILITATION OF SLOPE PROTECTION WORKS OF THE ROSABAN-POONBATO-BELBEL AND POONBATO-LIGLIG ROADS', 6, 10),
(DEFAULT, 'newRequest', '12/09/2013', 'RECONSTRUCTION/REPLACEMENT OF FLOOD CONTROL WORKS AND DRAINAGE STRUCTURES', 7, 11),
(DEFAULT, 'newRequest', '12/09/2013', 'REPAIR OF THE PORTION OF THE VINTAR FLOOD CONTROL STRUCTURE (DIKE) LOCATED AT BARANGAY #5', 8, 12),
(DEFAULT, 'newRequest', '12/26/2013', 'CONCRETING OF ACCESS ROAD AND CONSTRUCTION OF DRAINAGE SYSTEM (LEADING TO PAGLAUM RESETTLEMENT AREA), BRGY POBLACION', 9, 13),
(DEFAULT, 'newRequest', '09/25/2013', 'REPAIR/REHABILITATION OF BARANGAY ROADS ', 10, 14),
(DEFAULT, 'newRequest', '09/25/2013', 'REPAIR/REHABILITATION OF BARANGAY ROADS ', 11, 15),
(DEFAULT, 'newRequest', '02/13/2014', 'IMPROVEMENT/CONSTRUCTION O GRAVITY WALL WITH GABIONS AS FOUNDATION ALONG AGONON RIVER AT INTERMITITTENT SECTION FRON STA. 0+700-STA. 7+000, ANGONO, RIZAL', 12, 16),
(DEFAULT, 'newRequest', '02/24/2014', 'CONSTRUCTION/IMPROVEMENT OF POLA RIVER CONTROL AND SEAWALL (PHASE 4)', 13, 17),
(DEFAULT, 'newRequest', '02/24/2014', 'REPAIR/REHABILITATION OF FARM-TO-MARKETS, BRGY AGLAW AND BUHAWEN TO PROVINCIAL ROAD NETWORK, SAN MARCELINO, ZAMBALES', 14, 18),
(DEFAULT, 'newRequest', '02/24/2014', 'CONSTRUCTION OF ROADS', 15, 19),
(DEFAULT, 'newRequest', '02/24/2014', 'REHABILITATION/CONSTRUCTION OF BARANGAY ROADS', 16, 20),
(DEFAULT, 'newRequest', '02/24/2014', 'DESILTING OF RIVERS', 17, 21),
(DEFAULT, 'newRequest', '02/24/2014', 'CONSTRUCTION OF RIVER CONTROL PROJECTS IN THE PROVINCE OF ROMBLON', 18, 11),
(DEFAULT, 'newRequest', '02/13/2014', 'RECONSTRUCTION OF FLOOD CONTROL ALONG IPONAN RIVER, CAGAYAN DE ORO CITY AND MANDULOG RIVER, ILIGAN CITY', 19, 11),
(DEFAULT, 'newRequest', '02/14/2014', 'REPAIR/REHABILITATION OF SUCS BUILDINGS AND FACILITIES', 20, 22),
(DEFAULT, 'newRequest', '02/13/2014', 'CONSTRUCTION OF FLOOD CONTROL ALONG ILIGAN AND PUGA-AN RIVERS', 21, 11),
(DEFAULT, 'newRequest', '02/13/2014', 'REPAIR/RESTORATION OF INFRASTRUCTURE PROJECTS IN THE PROVINCE OF SURIGAO DEL NORTE AND DINAGAT ISLAND', 22, 11),
(DEFAULT, 'newRequest', '01/21/2014', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 23, 23),
(DEFAULT, 'newRequest', '05/15/2013', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 24, 24),
(DEFAULT, 'newRequest', '02/20/2014', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 25, 8),
(DEFAULT, 'newRequest', '02/20/2014', 'REPAIR/REHABILITATION OF WATER SYSTEM AND BAILEY BRIDGE IN MATUNGAO', 26, 25),
(DEFAULT, 'newRequest', '02/18/2014', 'DESILTING OF THE AGUSAN RIVER', 27, 26),
(DEFAULT, 'newRequest', '02/14/2014', 'CONSTRUCTION OF SEAWALL ALONG COAST LINE OF ALEJAWAN BRGY ROAD', 28, 27),
(DEFAULT, 'newRequest', '02/14/2014', 'PURCHASE OF DISASTER EQUIPMENT', 29, 28),
(DEFAULT, 'newRequest', '02/14/2014', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 30, 29),
(DEFAULT, 'newRequest', '02/13/2014', 'RECONSTRUCTION/REHABILITATION OF POBLACION WEST SEAWALL, LUBANG, OCCIDENTAL MINDORO', 31, 30),
(DEFAULT, 'newRequest', '02/13/2014', 'REPAIR/REHABILITATION OF ROADS', 32, 11),
(DEFAULT, 'newRequest', '02/13/2014', 'CONSTRUCTION/REPAIR/REHABILITATION OF FLOOD CONTROL PROJECTS', 33, 11),
(DEFAULT, 'newRequest', '02/13/2014', 'REPAIR/REHABILITATION OF FLOOD CONTROL PROEJCTS ALONG CAGAYAN RIVER', 34, 11),
(DEFAULT, 'newRequest', '02/07/2014', 'REHABILITATION OF INFRASTRUCTURE PROJECTS', 35, 31),
(DEFAULT, 'newRequest', '02/04/2014', 'CONSTRUCTION OF FLOOD CONTROL/DRAINAGE FACILITIES ALONG CEBU NORTH HAGNAYA WHARF ROAD & BOGO-CURVA-MEDELLIN-DAANBANTAYAN ROAD', 36, 11),
(DEFAULT, 'newRequest', '02/03/2014', 'REPAIR/REHABILITATION OF IRRIGATION FACILITIES', 37, 32),
(DEFAULT, 'newRequest', '01/21/2014', 'REPAIR/REHABILITATION OF IRRIGATION FACILITIES IN LUPON, DAVAO ORIENTAL', 38, 32),
(DEFAULT, 'newRequest', '02/13/2014', 'CONSTRUCTION OF MDMO ', 39, 33),
(DEFAULT, 'newRequest', '12/10/2013', 'REPAIR/REHABILITATION OF IRRIGATION FACILITIES IN ALBAY', 40, 32),
(DEFAULT, 'newRequest', '02/05/2014', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 41, 11),
(DEFAULT, 'newRequest', '01/15/2014', 'REPAIR/REHABILITATION OF ILOCOS NORTE-APAYAO ROAD', 42, 11),
(DEFAULT, 'newRequest', '01/13/2013', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS IN THE 1ST DISTRICT OF COMPOSTELA VALLEY', 43, 34),
(DEFAULT, 'newRequest', '10/17/2013', 'REHABILITATION/IMPROVEMENT OF FARM-TO-MARKET ROAD', 44, 35),
(DEFAULT, 'newRequest', '02/04/2014', 'CONSTRUCTION OF FARM-TO-MARKET ROADS IN 10 BARANGAYS', 45, 36),
(DEFAULT, 'newRequest', '02/03/2014', 'CONSTRUCTION OF FARM-TO-MARKET ROADS AT DAYAP-PUTAT-BUNDUCAN-UTOD SECTION', 46, 37),
(DEFAULT, 'newRequest', '02/03/2014', 'CONSTRUCTION OF FARM-TO-MARKET ROADS IN CATANDAAN-MAUGAT SECTION', 47, 37),
(DEFAULT, 'newRequest', '02/03/2014', 'REHABILITATION OF SITIO GASA-BAGONG SILANG - CUEVAS FARM-TO-MARKET ROAD AND NRJ POBLACION - SITIO GASA - TUDELA FMR', 48, 38),
(DEFAULT, 'newRequest', '01/16/2014', 'REHABILITATION AND UPGRADING OF THE POBLACION ROAD', 49, 39),
(DEFAULT, 'newRequest', '01/07/2014', 'CONSTRUCTION OF RIVER FLOOD CONTROL PROJECTS IN VIGA, CATANDUANES', 50, 40),
(DEFAULT, 'newRequest', '01/07/2014', 'REHABILITATION OF INFRASTRUCTURE PROJECTS', 51, 41),
(DEFAULT, 'newRequest', '01/17/2014', 'RECONSTRUCTION/REHABILITATION OF RIVER CONTROL PROJECTS', 52, 42),
(DEFAULT, 'newRequest', '01/22/2014', 'CONSTRUCTION OF FLOOD CONTROL STRUCTUREE IN BARANGAY PONGPONG', 53, 43),
(DEFAULT, 'newRequest', '01/22/2014', 'REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 54, 44),
(DEFAULT, 'newRequest', '01/22/2014', 'CONSTRUCTION OF FLOOD CONTROL STRUCTURES IN BRGYS CORDONA AND ISIT, DOLORES, ABRA', 55, 45),
(DEFAULT, 'newRequest', '01/07/2014', 'FINANCIAL ASSISTANCE FOR THE REPAIR OF HER HOUSE', 56, 46),
(DEFAULT, 'newRequest', '02/20/2014', 'REHABILITATION OF ROADS AND BRIDGE', 57, 11),
(DEFAULT, 'newRequest', '02/28/2014', 'REPAIR/REHABILITATION OF DIGMALA AND CORONEL RIVER CONTROL STRUCTURES', 58, 11),
(DEFAULT, 'newRequest', '02/28/2014', 'REHABILITATION OF RIVE CONTROL DIKE IN POBLACION 3', 59, 47),
(DEFAULT, 'newRequest', '02/26/2014', 'CONSTRUCTION OF RIVER PROTECTION AND GABION DIKES ', 60, 48),
(DEFAULT, 'newRequest', '02/26/2014', 'REHABILITATION OF RIVER BANK, ROADS AND DREDGING OF RIVER BANKS ', 61, 49),
(DEFAULT, 'newRequest', '01/17/2014', '1,000 HOUSING UNITS ', 62, 50),
(DEFAULT, 'newRequest', '01/16/2014', 'CONSTRUCTION OF EVACUATION CENTER ', 63, 49),
(DEFAULT, 'disaster', '11/28/2013', 'T QUINTA IN 2012:Typhoon', 1, null),
(DEFAULT, 'disaster', '12/10/2013', 'T LABUYO IN AUGUST 2013:Typhoon', 2, null),
(DEFAULT, 'disaster', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 3, null),
(DEFAULT, 'disaster', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 4, null),
(DEFAULT, 'disaster', '11/18/2013', 'T VINTA IN 2013:Typhoon', 5, null),
(DEFAULT, 'disaster', '11/27/2013', ':Typhoon', 6, null),
(DEFAULT, 'disaster', '12/09/2013', 'TS SENDONG 2011:Typhoon', 7, null),
(DEFAULT, 'disaster', '12/09/2013', 'T ODETTE IN 2013:Typhoon', 8, null),
(DEFAULT, 'disaster', '12/26/2013', 'TS SENDONG 2011:Typhoon', 9, null),
(DEFAULT, 'disaster', '09/25/2013', 'FLASHFLOOD IN JULY 2013:Typhoon', 10, null),
(DEFAULT, 'disaster', '09/25/2013', 'MONSOON RAINS IN 2012:Typhoon', 11, null),
(DEFAULT, 'disaster', '02/13/2014', 'HABAGAT & T MARING - AUGUST 18-20, 2013:Typhoon', 12, null),
(DEFAULT, 'disaster', '02/24/2014', ':Typhoon', 13, null),
(DEFAULT, 'disaster', '02/24/2014', 'T ODETTE IN 2013:Typhoon', 14, null),
(DEFAULT, 'disaster', '02/24/2014', ':Typhoon', 15, null),
(DEFAULT, 'disaster', '02/24/2014', ':Typhoon', 16, null),
(DEFAULT, 'disaster', '02/24/2014', 'HABAGAT - SEPT 2013:Typhoon', 17, null),
(DEFAULT, 'disaster', '02/24/2014', 'T YOLONDA - 2013:Typhoon', 18, null),
(DEFAULT, 'disaster', '02/13/2014', 'T SENDONG - 2011:Typhoon', 19, null),
(DEFAULT, 'disaster', '02/14/2014', 'T LABUYO, ODETTE, PABLO, SANTI, SENDONG, VINTA, YOLANDA, ZAMBOANGA SEIGE, AND CEBU & BOHOL EARTHQUAKE:Typhoon', 20, null),
(DEFAULT, 'disaster', '02/13/2014', 'T SENDONG - 2011:Typhoon', 21, null),
(DEFAULT, 'disaster', '02/13/2014', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 22, null),
(DEFAULT, 'disaster', '01/21/2014', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 23, null),
(DEFAULT, 'disaster', '05/15/2013', 'T QUINTA - 2012:Typhoon', 24, null),
(DEFAULT, 'disaster', '02/20/2014', 'T AGATON IN 2013:Typhoon', 25, null),
(DEFAULT, 'disaster', '02/20/2014', 'T AGATON IN 2013:Typhoon', 26, null),
(DEFAULT, 'disaster', '02/18/2014', 'T AGATON IN 2013:Typhoon', 27, null),
(DEFAULT, 'disaster', '02/14/2014', ':Typhoon', 28, null),
(DEFAULT, 'disaster', '02/14/2014', ':Typhoon', 29, null),
(DEFAULT, 'disaster', '02/14/2014', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 30, null),
(DEFAULT, 'disaster', '02/13/2014', 'T GENER, OFEL, PABLO IN 2012:Typhoon', 31, null),
(DEFAULT, 'disaster', '02/13/2014', 'T LABUYO, MARING & HABAGAT IN 2013:Typhoon', 32, null),
(DEFAULT, 'disaster', '02/13/2014', 'T ODETTE IN 2013:Typhoon', 33, null),
(DEFAULT, 'disaster', '02/13/2014', 'T LABUYO IN 2013:Typhoon', 34, null),
(DEFAULT, 'disaster', '02/07/2014', 'T LABUYO & MARING IN 2013:Typhoon', 35, null),
(DEFAULT, 'disaster', '02/04/2014', 'T YOLANDA IN NOVEMBER 08, 2013:Typhoon', 36, null),
(DEFAULT, 'disaster', '02/03/2014', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012:Typhoon', 37, null),
(DEFAULT, 'disaster', '01/21/2014', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012:Typhoon', 38, null),
(DEFAULT, 'disaster', '02/13/2014', ':Typhoon', 39, null),
(DEFAULT, 'disaster', '12/10/2013', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012:Typhoon', 40, null),
(DEFAULT, 'disaster', '02/05/2014', 'T SANTI - 2013:Typhoon', 41, null),
(DEFAULT, 'disaster', '01/15/2014', 'T ODETTE IN 2013:Typhoon', 42, null),
(DEFAULT, 'disaster', '01/13/2013', 'T PABLO - 2012:Typhoon', 43, null),
(DEFAULT, 'disaster', '10/17/2013', 'T PABLO - 2012:Typhoon', 44, null),
(DEFAULT, 'disaster', '02/04/2014', ':Typhoon', 45, null),
(DEFAULT, 'disaster', '02/03/2014', ':Typhoon', 46, null),
(DEFAULT, 'disaster', '02/03/2014', ':Typhoon', 47, null),
(DEFAULT, 'disaster', '02/03/2014', 'T PABLO - 2012:Typhoon', 48, null),
(DEFAULT, 'disaster', '01/16/2014', 'FLOODING:Typhoon', 49, null),
(DEFAULT, 'disaster', '01/07/2014', ':Typhoon', 50, null),
(DEFAULT, 'disaster', '01/07/2014', 'T LABUYO - 2013:Typhoon', 51, null),
(DEFAULT, 'disaster', '01/17/2014', ':Typhoon', 52, null),
(DEFAULT, 'disaster', '01/22/2014', ':Typhoon', 53, null),
(DEFAULT, 'disaster', '01/22/2014', 'T REMING & MILENYO:Typhoon', 54, null),
(DEFAULT, 'disaster', '01/22/2014', ':Typhoon', 55, null),
(DEFAULT, 'disaster', '01/07/2014', 'T YOLANDA:Typhoon', 56, null),
(DEFAULT, 'disaster', '02/20/2014', 'T YOLANDA:Typhoon', 57, null),
(DEFAULT, 'disaster', '02/28/2014', 'T LABUYO - 2013:Typhoon', 58, null),
(DEFAULT, 'disaster', '02/28/2014', 'T VINTA IN 2013:Typhoon', 59, null),
(DEFAULT, 'disaster', '02/26/2014', 'T YOLANDA:Typhoon', 60, null),
(DEFAULT, 'disaster', '02/26/2014', 'T NANDO, LABUYO & MARING - 2013:Typhoon', 61, null),
(DEFAULT, 'disaster', '01/17/2014', ':Typhoon', 62, null),
(DEFAULT, 'disaster', '01/16/2014', ':Typhoon', 63, null);;

--generated by csvParser.js
INSERT INTO checkpoints (req_id, gov_unit_id) VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 2),
(31, 2),
(32, 2),
(33, 2),
(34, 2),
(35, 2),
(36, 2),
(37, 2),
(38, 2),
(39, 2),
(40, 2),
(41, 2),
(42, 2),
(43, 2),
(44, 2),
(45, 2),
(46, 2),
(47, 2),
(48, 2),
(49, 2),
(50, 2),
(51, 2),
(52, 2),
(53, 2),
(54, 2),
(55, 2),
(56, 2),
(57, 2),
(58, 2),
(59, 2),
(60, 2),
(61, 2),
(62, 2),
(63, 2);;

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
