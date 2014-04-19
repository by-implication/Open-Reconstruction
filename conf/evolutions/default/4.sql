# --- !Ups

CREATE TABLE events (
	event_id serial PRIMARY KEY,
    event_kind text NOT NULL,
	event_date timestamp NOT NULL,
    event_content text,
    req_id int NOT NULL REFERENCES reqs
);;

--generated by csvParser.js
INSERT INTO events VALUES
(DEFAULT, 'reviseAmount', '01/13/2014', '7337329.40 7337329.40', 1),
(DEFAULT, 'comment', '01/13/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P7,337,329.40 TO LWUA FOR OP APPROVAL', 1),
(DEFAULT, 'reviseAmount', '01/13/2014', '1200000.00 1200000.00', 2),
(DEFAULT, 'comment', '01/13/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P1.2MILLION TO LWUA FOR OP APPROVAL', 2),
(DEFAULT, 'reviseAmount', '11/22/2013', ' ', 3),
(DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO VIII FOR INCLUSION ON THE PDNA FOR T YOLANDA', 3),
(DEFAULT, 'reviseAmount', '11/22/2013', ' ', 4),
(DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO VIII FOR INCLUSION ON THE PDNA FOR T YOLANDA', 4),
(DEFAULT, 'reviseAmount', '11/18/2013', ' ', 5),
(DEFAULT, 'comment', '12/27/2013', 'NDRRMC REFERRED TO OCDRO II FOR APPROPRIATE ACTION', 5),
(DEFAULT, 'reviseAmount', '11/27/2013', ' ', 6),
(DEFAULT, 'comment', '01/29/2014', 'NDRRMC REFERRED SAID REQUEST TO OCDRO 3 FOR APPROPRIATE ACTION ', 6),
(DEFAULT, 'reviseAmount', '01/22/2014', '137107000.00 137107000.00', 7),
(DEFAULT, 'comment', '01/22/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P137.107M CF FOR OP APPROVAL', 7),
(DEFAULT, 'reviseAmount', '12/09/2013', '104819000.00 ', 8),
(DEFAULT, 'comment', '01/27/2014', 'NDRRMC REFERRED THE REQUEST TO OCDR=O 1 FOR APPROPRIATE ACTION', 8),
(DEFAULT, 'reviseAmount', '12/26/2013', '7900000.00 ', 9),
(DEFAULT, 'comment', '01/28/2014', 'NDRRMC REFERRED TO DPWH FOR RE-ASSESSMENT AND RECOMMENDATION ', 9),
(DEFAULT, 'reviseAmount', '09/25/2013', '8000000.00 ', 10),
(DEFAULT, 'comment', '01/28/2014', 'NDRRMC REFERRED TO DPWH FOR RE-ASSESSMENT AND RECOMMENDATION ', 10),
(DEFAULT, 'reviseAmount', '09/25/2013', '29000000.00 ', 11),
(DEFAULT, 'comment', '01/28/2014', 'NDRRMC REFERRED TO DPWH FOR RE-ASSESSMENT AND RECOMMENDATION ', 11),
(DEFAULT, 'reviseAmount', '02/13/2014', '27779000.00 ', 12),
(DEFAULT, 'reviseAmount', '02/24/2014', '9500000.00 ', 13),
(DEFAULT, 'reviseAmount', '02/24/2014', '10000000.00 ', 14),
(DEFAULT, 'reviseAmount', '02/24/2014', '22873954.52 ', 15),
(DEFAULT, 'reviseAmount', '02/24/2014', '50000000.00 ', 16),
(DEFAULT, 'reviseAmount', '02/24/2014', ' ', 17),
(DEFAULT, 'reviseAmount', '02/24/2014', '226219000.00 ', 18),
(DEFAULT, 'reviseAmount', '02/13/2014', '248363075.00 ', 19),
(DEFAULT, 'reviseAmount', '02/14/2014', '4101042105.00 ', 20),
(DEFAULT, 'reviseAmount', '02/13/2014', '3620000.00 ', 21),
(DEFAULT, 'reviseAmount', '02/13/2014', '2755000.00 ', 22),
(DEFAULT, 'reviseAmount', '01/21/2014', '66819000.00 ', 23),
(DEFAULT, 'reviseAmount', '05/15/2013', '89000000.00 ', 24),
(DEFAULT, 'comment', '08/10/2013', 'REFERRED TO DPWH FOR VALIDATION AND RECOMMENDATION', 24),
(DEFAULT, 'reviseAmount', '02/20/2014', '39750000.00 ', 25),
(DEFAULT, 'reviseAmount', '02/20/2014', ' ', 26),
(DEFAULT, 'reviseAmount', '02/18/2014', '7500000.00 ', 27),
(DEFAULT, 'reviseAmount', '02/14/2014', '2000000.00 ', 28),
(DEFAULT, 'reviseAmount', '02/14/2014', '1000000.00 ', 29),
(DEFAULT, 'reviseAmount', '02/14/2014', '18560112.00 ', 30),
(DEFAULT, 'reviseAmount', '02/13/2014', '17000000.00 ', 31),
(DEFAULT, 'reviseAmount', '02/13/2014', '2809000.00 ', 32),
(DEFAULT, 'reviseAmount', '02/13/2014', '139736000.00 ', 33),
(DEFAULT, 'reviseAmount', '02/13/2014', '11371000.00 ', 34),
(DEFAULT, 'reviseAmount', '02/07/2014', '75000000.00 ', 35),
(DEFAULT, 'reviseAmount', '02/04/2014', '63000000.00 ', 36),
(DEFAULT, 'reviseAmount', '02/03/2014', '49500000.00 ', 37),
(DEFAULT, 'reviseAmount', '01/21/2014', '1000000.00 ', 38),
(DEFAULT, 'reviseAmount', '02/13/2014', '2500000.00 ', 39),
(DEFAULT, 'reviseAmount', '12/10/2013', '3005000.00 ', 40),
(DEFAULT, 'reviseAmount', '02/05/2014', '196422363.89 ', 41),
(DEFAULT, 'reviseAmount', '01/15/2014', '10000000.00 ', 42),
(DEFAULT, 'reviseAmount', '01/13/2013', '122130000.00 ', 43),
(DEFAULT, 'reviseAmount', '10/17/2013', '10000000.00 ', 44),
(DEFAULT, 'reviseAmount', '02/04/2014', '20000000.00 ', 45),
(DEFAULT, 'reviseAmount', '02/03/2014', '31000000.00 ', 46),
(DEFAULT, 'reviseAmount', '02/03/2014', '17000000.00 ', 47),
(DEFAULT, 'reviseAmount', '02/03/2014', '100000000.00 ', 48),
(DEFAULT, 'reviseAmount', '01/16/2014', '10000000.00 ', 49),
(DEFAULT, 'reviseAmount', '01/07/2014', '45000000.00 ', 50),
(DEFAULT, 'reviseAmount', '01/07/2014', '12782666.00 ', 51),
(DEFAULT, 'reviseAmount', '01/17/2014', '70000000.00 ', 52),
(DEFAULT, 'reviseAmount', '01/22/2014', '5435903.00 ', 53),
(DEFAULT, 'reviseAmount', '01/22/2014', '160000000.00 ', 54),
(DEFAULT, 'reviseAmount', '01/22/2014', '30000000.00 ', 55),
(DEFAULT, 'reviseAmount', '01/07/2014', ' ', 56),
(DEFAULT, 'comment', '02/27/2014', 'NDRRMC REFERRED TO DSWD FOR APPROPRIATE ACTION', 56),
(DEFAULT, 'reviseAmount', '02/20/2014', '62073000.00 ', 57),
(DEFAULT, 'comment', '02/20/2014', 'NDRRMC RECOMMENDED THE RELEASE OF P62.073M TO DPWH ILOILO 3RD DEO FOR OP APPROVAL', 57),
(DEFAULT, 'reviseAmount', '02/28/2014', '55352338.44 ', 58),
(DEFAULT, 'reviseAmount', '02/28/2014', '3800000.00 ', 59),
(DEFAULT, 'reviseAmount', '02/26/2014', '195000000.00 ', 60),
(DEFAULT, 'reviseAmount', '02/26/2014', '53000000.00 ', 61),
(DEFAULT, 'reviseAmount', '01/17/2014', ' ', 62),
(DEFAULT, 'reviseAmount', '01/16/2014', ' ', 63);;

# --- !Downs

DROP TABLE IF EXISTS events;;
