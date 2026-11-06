-- Synthetic demo data. Reservations are relative to today so they always lie in the future.
INSERT INTO room (name, capacity, floor) VALUES ('Eiger', 12, 1);
INSERT INTO room (name, capacity, floor) VALUES ('Moench', 6, 1);
INSERT INTO room (name, capacity, floor) VALUES ('Jungfrau', 20, 2);
INSERT INTO room (name, capacity, floor) VALUES ('Pilatus', 4, 3);

INSERT INTO reservation (room_id, title, organizer, start_time, end_time)
VALUES (1, 'Sprint Planning', 'Team Atlas', DATEADD('HOUR', 33, CURRENT_DATE), DATEADD('HOUR', 35, CURRENT_DATE));
INSERT INTO reservation (room_id, title, organizer, start_time, end_time)
VALUES (1, 'Architektur-Review', 'Team Boreal', DATEADD('HOUR', 38, CURRENT_DATE), DATEADD('HOUR', 39, CURRENT_DATE));
INSERT INTO reservation (room_id, title, organizer, start_time, end_time)
VALUES (3, 'Quartalsrückblick', 'Team Cirrus', DATEADD('HOUR', 57, CURRENT_DATE), DATEADD('HOUR', 60, CURRENT_DATE));
