INSERT INTO BUILDING(BuildingName, BuildingImageLink)
VALUES("Charles Library", "https://www.architecturalrecord.com/ext/resources/Issues/2020/11-November/Charles-Library-01-B.jpg?1604349861");

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES("First Floor Lounge", (SELECT BuildingID FROM BUILDING WHERE BuildingName = "Charles Library"));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES("Main Study Area", (SELECT BuildingID FROM BUILDING WHERE BuildingName = "Charles Library"));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES("Quiet Room", (SELECT BuildingID FROM BUILDING WHERE BuildingName = "Charles Library"));

INSERT INTO LOCATION(LocationName, BuildingID)
VALUES("Open Seating Near Windows", (SELECT BuildingID FROM BUILDING WHERE BuildingName = "Charles Library"));
