# --- !Ups

-- CREATE TYPE project_type AS ENUM(
-- 	'Infrastructure',
-- 	'Agriculture',
-- 	'School Building',
-- 	'Health Facilities',
-- 	'Shelter Units',
-- 	'Environment',
-- 	'Other'
-- );;

--generated by csvParser.js
CREATE TYPE project_type AS ENUM(
'Bridge',
'Building',
'Equipment',
'Evac Center',
'Financial Aid',
'Flood Control',
'Housing',
'Irrigation System',
'River Control',
'Rivers',
'Road',
'School Building',
'Seawall',
'Water System',
'Others');;

CREATE TYPE project_scope AS ENUM(
	'Reconstruction',
	'Repair',
	'Prevention',
	'Other'
);;

CREATE TABLE reqs (
	req_id serial PRIMARY KEY,
	req_description text NOT NULL,
	req_project_type project_type NOT NULL,
	req_amount numeric(15,2) NOT NULL,
	req_scope project_scope NOT NULL DEFAULT 'Repair',
	req_date timestamp NOT NULL DEFAULT NOW(),
	-- req_code text NOT NULL,
	req_level int NOT NULL DEFAULT 0,
	req_validated boolean NOT NULL DEFAULT FALSE,
	req_rejected boolean NOT NULL DEFAULT FALSE,
	author_id int NOT NULL REFERENCES users(user_id),
	assessing_agency_id int REFERENCES agencys(agency_id),
	implementing_agency_id int REFERENCES agencys(agency_id),
	req_location text NOT NULL,
	req_remarks text,
	req_attachment_ids int[] NOT NULL DEFAULT '{}',
	req_disaster_type disaster_type NOT NULL DEFAULT 'Typhoon',
	req_disaster_date timestamp NOT NULL,
	req_disaster_name text
);;

--generated by csvParser.js
INSERT INTO reqs (req_description, req_project_type, req_amount, req_date, author_id, req_location, req_disaster_date, req_disaster_name) VALUES
('REPAIR/REHABILITATION OF WATER SUPPLY SYSTEMS IN CAPIZ AND ILOILO', 'Water System', 7337329.40, '11/28/2013', 6, 'Region 6', '11/28/2013', 'T QUINTA IN 2012'),
('REHABILITATION OF DIPACULAO WATER DISTRICT ', 'Water System', 1200000.00, '12/10/2013', 6, 'DIPACULAO, AURORA, Region 3', '12/10/2013', 'T LABUYO IN AUGUST 2013'),
('REHABILITATION OF INFRASTRUCTURE PROJECT', 'Others', 0.00, '11/22/2013', 7, 'SAN ISIDRO, LEYTE, Region 8', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REHABILITATION OF INFRASTRUCTURE PROJECT', 'Others', 0.00, '11/22/2013', 8, 'SAN ROQUE, NORTHERN SAMAR, Region 8', '11/22/2013', 'T YOLANDA IN NOVEMBER 08, 2013'),
('FINANCIAL ASSISTANCE ', 'Financial Aid', 0.00, '11/18/2013', 9, 'PIAT, CAGAYAN, Region 2', '11/18/2013', 'T VINTA IN 2013'),
('IMPROVEMENT/REHABILITATION OF SLOPE PROTECTION WORKS OF THE ROSABAN-POONBATO-BELBEL AND POONBATO-LIGLIG ROADS', 'Road', 0.00, '11/27/2013', 10, 'ZAMBALES, Region 3', '11/27/2013', ''),
('RECONSTRUCTION/REPLACEMENT OF FLOOD CONTROL WORKS AND DRAINAGE STRUCTURES', 'Others', 137107000.00, '12/09/2013', 11, 'Region 10', '12/09/2013', 'TS SENDONG 2011'),
('REPAIR OF THE PORTION OF THE VINTAR FLOOD CONTROL STRUCTURE (DIKE) LOCATED AT BARANGAY #5', 'Flood Control', 104819000.00, '12/09/2013', 12, 'VINTAR, ILOCOS NORTE, Region 1', '12/09/2013', 'T ODETTE IN 2013'),
('CONCRETING OF ACCESS ROAD AND CONSTRUCTION OF DRAINAGE SYSTEM (LEADING TO PAGLAUM RESETTLEMENT AREA), BRGY POBLACION', 'Road', 7900000.00, '12/26/2013', 13, 'LIBONA, BUKIDNON, Region 10', '12/26/2013', 'TS SENDONG 2011'),
('REPAIR/REHABILITATION OF BARANGAY ROADS ', 'Road', 8000000.00, '09/25/2013', 14, 'AMPATUAN, MAGUINDANAO, Region 16', '09/25/2013', 'FLASHFLOOD IN JULY 2013'),
('REPAIR/REHABILITATION OF BARANGAY ROADS ', 'Road', 29000000.00, '09/25/2013', 15, 'GEN SALIPADA PENDATUN, MAGUINDANAO, Region 16', '09/25/2013', 'MONSOON RAINS IN 2012'),
('IMPROVEMENT/CONSTRUCTION O GRAVITY WALL WITH GABIONS AS FOUNDATION ALONG AGONON RIVER AT INTERMITITTENT SECTION FRON STA. 0+700-STA. 7+000, ANGONO, RIZAL', 'Others', 27779000.00, '02/13/2014', 16, 'ANGONO, RIZAL, Region 4', '02/13/2014', 'HABAGAT & T MARING - AUGUST 18-20, 2013'),
('CONSTRUCTION/IMPROVEMENT OF POLA RIVER CONTROL AND SEAWALL (PHASE 4)', 'River Control', 9500000.00, '02/24/2014', 17, 'POLA, ORIENTAL MINDORO, Region 4', '02/24/2014', ''),
('REPAIR/REHABILITATION OF FARM-TO-MARKETS, BRGY AGLAW AND BUHAWEN TO PROVINCIAL ROAD NETWORK, SAN MARCELINO, ZAMBALES', 'Road', 10000000.00, '02/24/2014', 18, 'SAN MARCELINO, ZAMBALES, Region 3', '02/24/2014', 'T ODETTE IN 2013'),
('CONSTRUCTION OF ROADS', 'Road', 22873954.52, '02/24/2014', 19, 'BOSTON, DAVAO ORIENTAL, Region 11', '02/24/2014', ''),
('REHABILITATION/CONSTRUCTION OF BARANGAY ROADS', 'Road', 50000000.00, '02/24/2014', 20, 'PRESENTACION, CAMARINES SUR, Region 5', '02/24/2014', ''),
('DESILTING OF RIVERS', 'Rivers', 0.00, '02/24/2014', 21, 'SUBIC, ZAMBALES, Region 3', '02/24/2014', 'HABAGAT - SEPT 2013'),
('CONSTRUCTION OF RIVER CONTROL PROJECTS IN THE PROVINCE OF ROMBLON', 'River Control', 226219000.00, '02/24/2014', 11, 'ROMBLON, Region 4', '02/24/2014', 'T YOLONDA - 2013'),
('RECONSTRUCTION OF FLOOD CONTROL ALONG IPONAN RIVER, CAGAYAN DE ORO CITY AND MANDULOG RIVER, ILIGAN CITY', 'River Control', 248363075.00, '02/13/2014', 11, 'Region 10', '02/13/2014', 'T SENDONG - 2011'),
('REPAIR/REHABILITATION OF SUCS BUILDINGS AND FACILITIES', 'School Building', 4101042105.00, '02/14/2014', 22, '', '02/14/2014', 'T LABUYO, ODETTE, PABLO, SANTI, SENDONG, VINTA, YOLANDA, ZAMBOANGA SEIGE, AND CEBU & BOHOL EARTHQUAKE'),
('CONSTRUCTION OF FLOOD CONTROL ALONG ILIGAN AND PUGA-AN RIVERS', 'Flood Control', 3620000.00, '02/13/2014', 11, 'ILIGAN CITY, LANAO DEL NORTE, Region 10', '02/13/2014', 'T SENDONG - 2011'),
('REPAIR/RESTORATION OF INFRASTRUCTURE PROJECTS IN THE PROVINCE OF SURIGAO DEL NORTE AND DINAGAT ISLAND', 'Others', 2755000.00, '02/13/2014', 11, 'Region 13', '02/13/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 66819000.00, '01/21/2014', 23, 'CATANDUANES, Region 5', '01/21/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 89000000.00, '05/15/2013', 24, 'DUMANGAS, ILOILO, Region 6', '05/15/2013', 'T QUINTA - 2012'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 39750000.00, '02/20/2014', 8, 'SAN ROQUE, NORTHERN SAMAR, Region 8', '02/20/2014', 'T AGATON IN 2013'),
('REPAIR/REHABILITATION OF WATER SYSTEM AND BAILEY BRIDGE IN MATUNGAO', 'Others', 0.00, '02/20/2014', 25, 'MATUNGAO, LANAO DEL NORTE, Region 10', '02/20/2014', 'T AGATON IN 2013'),
('DESILTING OF THE AGUSAN RIVER', 'Others', 7500000.00, '02/18/2014', 26, 'BUTUAN CITY, AGUSAN DEL NORTE, Region 13', '02/18/2014', 'T AGATON IN 2013'),
('CONSTRUCTION OF SEAWALL ALONG COAST LINE OF ALEJAWAN BRGY ROAD', 'Seawall', 2000000.00, '02/14/2014', 27, 'ALEJAWAN, JAGNA, BOHOL, Region 7', '02/14/2014', ''),
('PURCHASE OF DISASTER EQUIPMENT', 'Equipment', 1000000.00, '02/14/2014', 28, 'CANTAGAY, JAGNA, BOHOL, Region 7', '02/14/2014', ''),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 18560112.00, '02/14/2014', 29, 'SAN RICARDO, SOUTHERN LEYTE, Region 8', '02/14/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('RECONSTRUCTION/REHABILITATION OF POBLACION WEST SEAWALL, LUBANG, OCCIDENTAL MINDORO', 'Seawall', 17000000.00, '02/13/2014', 30, 'LUBANG, OCCIDENTAL MINDORO, Region 4', '02/13/2014', 'T GENER, OFEL, PABLO IN 2012'),
('REPAIR/REHABILITATION OF ROADS', 'Road', 2809000.00, '02/13/2014', 11, 'PANGASINAN, Region 1', '02/13/2014', 'T LABUYO, MARING & HABAGAT IN 2013'),
('CONSTRUCTION/REPAIR/REHABILITATION OF FLOOD CONTROL PROJECTS', 'Flood Control', 139736000.00, '02/13/2014', 11, 'ILOCOS NORTE, Region 1', '02/13/2014', 'T ODETTE IN 2013'),
('REPAIR/REHABILITATION OF FLOOD CONTROL PROEJCTS ALONG CAGAYAN RIVER', 'Flood Control', 11371000.00, '02/13/2014', 11, 'ISABELA, Region 2', '02/13/2014', 'T LABUYO IN 2013'),
('REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 75000000.00, '02/07/2014', 31, 'CABA, LA UNION, Region 1', '02/07/2014', 'T LABUYO & MARING IN 2013'),
('CONSTRUCTION OF FLOOD CONTROL/DRAINAGE FACILITIES ALONG CEBU NORTH HAGNAYA WHARF ROAD & BOGO-CURVA-MEDELLIN-DAANBANTAYAN ROAD', 'Others', 63000000.00, '02/04/2014', 11, 'CEBU, Region 7', '02/04/2014', 'T YOLANDA IN NOVEMBER 08, 2013'),
('REPAIR/REHABILITATION OF IRRIGATION FACILITIES', 'Irrigation System', 49500000.00, '02/03/2014', 32, 'DAVAO DEL NORTE, Region 11', '02/03/2014', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012'),
('REPAIR/REHABILITATION OF IRRIGATION FACILITIES IN LUPON, DAVAO ORIENTAL', 'Irrigation System', 1000000.00, '01/21/2014', 32, 'LUPON, DAVAO ORIENTAL, Region 11', '01/21/2014', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012'),
('CONSTRUCTION OF MDMO ', 'Building', 2500000.00, '02/13/2014', 33, 'ALICIA, ZAMBOANGA SIBUGAY, Region 9', '02/13/2014', ''),
('REPAIR/REHABILITATION OF IRRIGATION FACILITIES IN ALBAY', 'Irrigation System', 3005000.00, '12/10/2013', 32, 'ALBAY, Region 5', '12/10/2013', 'T GENER, HELEN, OFEL, PABLO, AND HANGING HABAGAT IN 2012'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 196422363.89, '02/05/2014', 11, 'Region 3', '02/05/2014', 'T SANTI - 2013'),
('REPAIR/REHABILITATION OF ILOCOS NORTE-APAYAO ROAD', 'Road', 10000000.00, '01/15/2014', 11, 'SOLSONA, ILOCOS NORTE, Region 1', '01/15/2014', 'T ODETTE IN 2013'),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS IN THE 1ST DISTRICT OF COMPOSTELA VALLEY', 'Others', 122130000.00, '01/13/2013', 34, 'COMPOSTELA VALLEY, Region 11', '01/13/2013', 'T PABLO - 2012'),
('REHABILITATION/IMPROVEMENT OF FARM-TO-MARKET ROAD', 'Road', 10000000.00, '10/17/2013', 35, 'PILAR, ABRA, Region 15', '10/17/2013', 'T PABLO - 2012'),
('CONSTRUCTION OF FARM-TO-MARKET ROADS IN 10 BARANGAYS', 'Road', 20000000.00, '02/04/2014', 36, 'LIAN, BATANGAS, Region 4', '02/04/2014', ''),
('CONSTRUCTION OF FARM-TO-MARKET ROADS AT DAYAP-PUTAT-BUNDUCAN-UTOD SECTION', 'Road', 31000000.00, '02/03/2014', 37, 'NASUGBU, BATANGAS, Region 4', '02/03/2014', ''),
('CONSTRUCTION OF FARM-TO-MARKET ROADS IN CATANDAAN-MAUGAT SECTION', 'Road', 17000000.00, '02/03/2014', 37, 'NASUGBU, BATANGAS, Region 4', '02/03/2014', ''),
('REHABILITATION OF SITIO GASA-BAGONG SILANG - CUEVAS FARM-TO-MARKET ROAD AND NRJ POBLACION - SITIO GASA - TUDELA FMR', 'Road', 100000000.00, '02/03/2014', 38, 'TRENTO, AGUSAN DEL SUR, Region 13', '02/03/2014', 'T PABLO - 2012'),
('REHABILITATION AND UPGRADING OF THE POBLACION ROAD', 'Road', 10000000.00, '01/16/2014', 39, 'CANDABA, PAMPANGA, Region 3', '01/16/2014', 'FLOODING'),
('CONSTRUCTION OF RIVER FLOOD CONTROL PROJECTS IN VIGA, CATANDUANES', 'Flood Control', 45000000.00, '01/07/2014', 40, 'VIGA, CATANDUANES, Region 5', '01/07/2014', ''),
('REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 12782666.00, '01/07/2014', 41, 'MADELLA, QUIRINO, Region 2', '01/07/2014', 'T LABUYO - 2013'),
('RECONSTRUCTION/REHABILITATION OF RIVER CONTROL PROJECTS', 'Flood Control', 70000000.00, '01/17/2014', 42, 'CALAPAN, ORIENTAL MINDORO, Region 4', '01/17/2014', ''),
('CONSTRUCTION OF FLOOD CONTROL STRUCTUREE IN BARANGAY PONGPONG', 'Flood Control', 5435903.00, '01/22/2014', 43, 'STA MARIA, DAVAO DEL SUR, Region 11', '01/22/2014', ''),
('REPAIR/REHABILITATION OF INFRASTRUCTURE PROJECTS', 'Others', 160000000.00, '01/22/2014', 44, 'STA MAGDALENA, SORSOGON, Region 5', '01/22/2014', 'T REMING & MILENYO'),
('CONSTRUCTION OF FLOOD CONTROL STRUCTURES IN BRGYS CORDONA AND ISIT, DOLORES, ABRA', 'Flood Control', 30000000.00, '01/22/2014', 45, 'DOLORES, ABRA, Region 15', '01/22/2014', ''),
('FINANCIAL ASSISTANCE FOR THE REPAIR OF HER HOUSE', 'Housing', 0.00, '01/07/2014', 46, 'PRESIDENT ROXAS, CAPIZ, Region 6', '01/07/2014', 'T YOLANDA'),
('REHABILITATION OF ROADS AND BRIDGE', 'Road', 62073000.00, '02/20/2014', 11, 'ILOILO, Region 6', '02/20/2014', 'T YOLANDA'),
('REPAIR/REHABILITATION OF DIGMALA AND CORONEL RIVER CONTROL STRUCTURES', 'River Control', 55352338.44, '02/28/2014', 11, 'NUEVE ECIJA, Region 3', '02/28/2014', 'T LABUYO - 2013'),
('REHABILITATION OF RIVE CONTROL DIKE IN POBLACION 3', 'River Control', 3800000.00, '02/28/2014', 47, 'ADAMS, ILOCOS NORTE, Region 1', '02/28/2014', 'T VINTA IN 2013'),
('CONSTRUCTION OF RIVER PROTECTION AND GABION DIKES ', 'River Control', 195000000.00, '02/26/2014', 48, 'ORIENTAL MINDORO, Region 4', '02/26/2014', 'T YOLANDA'),
('REHABILITATION OF RIVER BANK, ROADS AND DREDGING OF RIVER BANKS ', 'Others', 53000000.00, '02/26/2014', 49, 'SAN FABIAN, PANGASINAN, Region 1', '02/26/2014', 'T NANDO, LABUYO & MARING - 2013'),
('1,000 HOUSING UNITS ', 'Housing', 0.00, '01/17/2014', 50, 'SUAL, PANGASINAN, Region 1', '01/17/2014', ''),
('CONSTRUCTION OF EVACUATION CENTER ', 'Evac Center', 0.00, '01/16/2014', 49, 'SAN FABIAN, PANGASINAN, Region 1', '01/16/2014', '');;

CREATE TABLE attachments (
	attachment_id serial PRIMARY KEY,
	attachment_date_uploaded timestamp NOT NULL DEFAULT NOW(),
	attachment_filename text NOT NULL,
	uploader_id int NOT NULL REFERENCES users(user_id),
	attachment_image boolean NOT NULL
);;

# --- !Downs

DROP TABLE IF EXISTS attachments;;

DROP TABLE IF EXISTS reqs;;

DROP TYPE IF EXISTS project_scope;;

DROP TYPE IF EXISTS project_type;;
