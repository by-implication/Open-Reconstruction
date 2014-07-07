# --- !Ups

CREATE TABLE requirements (
	requirement_id serial PRIMARY KEY,
	requirement_name text NOT NULL,
	requirement_description text NOT NULL,
	req_level int NOT NULL,
	requirement_target text NOT NULL,
	requirement_image boolean NOT NULL DEFAULT false
);

INSERT INTO requirements (requirement_name, requirement_description, req_level, requirement_target) VALUES
	('Sangguniang Resolution', 'Sangguniang Resolution declaring the area under a State of Calamity / Imminent Danger and appropriating local counterpart for the project', 0, 'NGA'),
	('Assurance Certificate', 'Certification by Local Chief Executive (LCE) concerned thru a Sangguniang Resolution assuring that whatever amount will be provided by the Office of the President (OP), the project will be completed/finished', 0, 'NGA'),
	('Emergency Certificate', 'Certification and justification by the LCE concerned that funding requests chargeable against Calamity Fund are of an emergency in character', 0, 'NGA'),
	('Financial Certificate', 'Certification by the Local Accountant or Finance Officer that their Local Calamity Fund is already depleted/exhausted and/or non-availability of funding source other than the Calamity Fund', 0, 'NGA'),
	('Non-insurance Certificate', 'Certification that the infrastructures being requested for funding support are not covered by insurance', 0, 'NGA'),
	('Program / Plan', 'Work and financial program/plan of the agency', 0, 'LGU'),
	('Endorsement', 'Endorsement of the Department Secretary or Head of Agency requesting for funding assistance', 0, 'LGU'),
	('Implementation Certificate', 'Certification by the DPWH that the concerned LGU is capable of implementing the project', 1, 'NGA'),
	('Others', 'Other pertinent documents which may be required by the Council such as an independent validation of the project by the DPWH Regional Director/District Engineer', 1, 'NGA'),
	('DPWH Validation', 'Validation/recommendation from the DPWH Secretary', 1, 'NGA'),
	('Assessor Validation', 'Validation/evaluation of appropriate agency to whom the NDRRMC referred the request', 1, 'LGU'),
	('LDRRMC Report', 'Local Disaster Risk Reduction and Management Council (DRRMC) Damage Report/ Calamity Impact Assessment Report/ Work and financial Plan (to include colored pictures)', 2, 'NGA'),
	('RDRRMC Endorsement', 'Endorsement of RDRRMC Chairperson (OCD Regional Director)', 2, 'NGA'),
	('Others', 'Other pertinent documents which may be required by the Council such as an independent evaluation of the project from the concerned agencies/departments (additional documents may be requested by OCD via comments)', 2, 'LGU');

ALTER TABLE attachments
	ADD COLUMN requirement_id int NOT NULL REFERENCES requirements,
	DROP COLUMN attachment_image;

# --- !Downs

ALTER TABLE attachments
	ADD COLUMN attachment_image boolean NOT NULL,
	DROP COLUMN requirement_id;

DROP TABLE requirements;
