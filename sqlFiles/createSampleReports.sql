INSERT INTO REPORT (LocationID, NoiseLevel, CrowdLevel, Description, TimeOfReport)
VALUES 
(1, 3, 5, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '17 hours'), 
(1, 2, 2, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '14 hours'), 
(1, 4, 2, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '20 hours'), 
(1, 1, 1, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '15 hours'), 
(1, 4, 5, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '12 hours'), 

(2, 3, 4, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '16 hours'), 
(2, 1, 2, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '11 hours'), 
(2, 1, 1, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '19 hours'), 
(2, 2, 1, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '18 hours'), 
(2, 3, 3, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '12 hours'), 

(3, 4, 4, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '21 hours'), 
(3, 4, 4, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '15 hours'), 
(3, 5, 5, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '22 hours'), 
(3, 1, 4, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '17 hours'), 
(3, 4, 2, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '19 hours'), 

(4, 3, 5, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '20 hours'), 
(4, 1, 2, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '12 hours'), 
(4, 1, 1, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '18 hours'), 
(4, 3, 3, '', date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '21 hours'), 
(4, 4, 5, '', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '14 hours'); 
