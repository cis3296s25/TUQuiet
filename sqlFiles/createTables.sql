CREATE TABLE IF NOT EXISTS BUILDING (
    BuildingID SERIAL PRIMARY KEY,
    BuildingName VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS LOCATION (
    LocationID SERIAL PRIMARY KEY,
    LocationName VARCHAR(64) NOT NULL,
    BuildingID INT NOT NULL,
    FOREIGN KEY (BuildingID) REFERENCES BUILDING(BuildingID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS APP_USER (
    UserID SERIAL PRIMARY KEY,
    UserEmail VARCHAR(64) UNIQUE NOT NULL,
    UserPassword VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS REPORT (
    ReportID SERIAL,
    LocationID INT,
    NoiseLevel INT CHECK (NoiseLevel BETWEEN 0 AND 10),
    CrowdLevel INT CHECK (CrowdLevel BETWEEN 0 AND 10),
    Description VARCHAR(256),
    UserID INT, 
    FOREIGN KEY (LocationID) REFERENCES LOCATION(LocationID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES APP_USER(UserID) ON DELETE SET NULL,
    PRIMARY KEY (ReportID, LocationID)
);