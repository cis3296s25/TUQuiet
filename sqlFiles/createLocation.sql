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

INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES('Tuttleman Learning Center', 'https://live.staticflickr.com/7352/12726907453_a015906382.jpg');

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Basement Study Space', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tuttleman Learning Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Honors Lounge', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tuttleman Learning Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Third Floor Study Space', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tuttleman Learning Center'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Fourth Floor Study Space', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Tuttleman Learning Center'));

INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES('Outside Around Campus', 'https://bellwetherdesigntech.com/wp-content/uploads/2021/05/Temple-7-edited.jpg');

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Beury Beach', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Outside Around Campus'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Founder''s Garden', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Outside Around Campus'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('The Wall', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Outside Around Campus'));

/*Want a better name for this. I am thinking about the tables outside of Alter and 1810*/
INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Liacouras Walk Tables', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Outside Around Campus'));

INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES('Mazur Hall', 'https://freight.cargo.site/t/original/i/36096b340a5b8a6c8494e02cd728775c8fdefa2bcd48c0ec2a6a0048a05084a5/2021_07_22_emtah15_a.jpg');

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Mazur Terrace', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Mazur Hall'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Mazur Lobby', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Mazur Hall'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Mazur Lobby Second Floor', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Mazur Hall'));

INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES('Alter Hall', 'https://cdn.britannica.com/44/153544-004-BC2F3A48.jpg');

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Saxby''s Coffee', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Alter Hall'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('Central Market Room', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Alter Hall'));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES('7th Floor', (SELECT BuildingID FROM BUILDING WHERE BuildingName = 'Alter Hall'));

