-- Synthetic demo data (no real NCTS data). Dates are relative to today so open declarations lie in the future.
INSERT INTO customs_office (code, name, role) VALUES ('CH001234', 'Basel/Weil-Autobahn', 'BOTH');
INSERT INTO customs_office (code, name, role) VALUES ('CH002345', 'Chiasso-Brogeda', 'BOTH');
INSERT INTO customs_office (code, name, role) VALUES ('CH003456', 'Zürich-Flughafen', 'DESTINATION');
INSERT INTO customs_office (code, name, role) VALUES ('CH004567', 'Genève-Routes', 'BOTH');
INSERT INTO customs_office (code, name, role) VALUES ('CH005678', 'Kreuzlingen-Autobahn', 'DEPARTURE');
INSERT INTO customs_office (code, name, role) VALUES ('CH006789', 'St. Margrethen', 'BOTH');

INSERT INTO guarantee (grn, holder, reference_amount) VALUES ('26CH1000000000011', 'Rhein Logistik AG', 50000.00);
INSERT INTO guarantee (grn, holder, reference_amount) VALUES ('26CH1000000000022', 'Ticino Trasporti SA', 20000.00);
INSERT INTO guarantee (grn, holder, reference_amount) VALUES ('26CH1000000000033', 'Léman Fret Sàrl', 10000.00);

INSERT INTO transit_declaration (mrn, departure_office, destination_office, guarantee_reference, amount, released_at, deadline, status)
VALUES ('26CH0000000000001R', 'CH001234', 'CH003456', '26CH1000000000011', 12500.00, DATEADD('HOUR', 33, CURRENT_DATE), DATEADD('DAY', 6, CURRENT_DATE), 'OPEN');
INSERT INTO transit_declaration (mrn, departure_office, destination_office, guarantee_reference, amount, released_at, deadline, status)
VALUES ('26CH00000000000028', 'CH002345', 'CH001234', '26CH1000000000022', 7800.00, DATEADD('HOUR', 38, CURRENT_DATE), DATEADD('DAY', 4, CURRENT_DATE), 'OPEN');
INSERT INTO transit_declaration (mrn, departure_office, destination_office, guarantee_reference, amount, released_at, deadline, status)
VALUES ('26CH0000000000003P', 'CH004567', 'CH001234', '26CH1000000000033', 9500.00, DATEADD('HOUR', 57, CURRENT_DATE), DATEADD('DAY', 8, CURRENT_DATE), 'OPEN');
-- Already arrived: no longer counts against the guarantee.
INSERT INTO transit_declaration (mrn, departure_office, destination_office, guarantee_reference, amount, released_at, deadline, status)
VALUES ('26CH00000000000046', 'CH005678', 'CH002345', '26CH1000000000033', 4000.00, DATEADD('HOUR', -30, CURRENT_DATE), DATEADD('DAY', 2, CURRENT_DATE), 'ARRIVED');
