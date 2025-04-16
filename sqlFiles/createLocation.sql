INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES('Charles Library', 'https://www.architecturalrecord.com/ext/resources/Issues/2020/11-November/Charles-Library-01-B.jpg?1604349861');

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('First Floor Lounge', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Charles Library'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Main Study Area', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Charles Library'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Quiet Room', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Charles Library'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Open Seating Near Windows', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Charles Library'));

INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES('Tech Center', 'https://its.temple.edu/sites/its/files/media/image/20161129_HSCTech_021.jpg?v=346761');

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('First Floor Cafe', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tech Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Yellow Section', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tech Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Red Section', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tech Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Purple Section', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tech Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Orange Section', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tech Center'));

INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES('Science Education and Research Center', 'https://www.arcusa.com/sites/default/files/2021-10/ARCSERC04_A.jpg');

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('First Floor', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Science Education and Research Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Second Floor', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Science Education and Research Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Lab Room 204', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Science Education and Research Center'));

