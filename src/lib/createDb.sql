--  MariaDB Syntax --
DROP TABLE IF EXISTS `GameCharacter`, `MuUser`;

CREATE TABLE MuUser(
   userId INT NOT NULL AUTO_INCREMENT,
   username VARCHAR(32) NOT NULL,
   email VARCHAR(191) NOT NULL,
   hashPass VARCHAR(128) NOT NULL,
   registerDate VARCHAR(14) NOT NULL,
   verifyToken VARCHAR(191),
   PRIMARY KEY(userId),
   UNIQUE(username),
   UNIQUE(email),
   UNIQUE(verifyToken)
);

CREATE TABLE GameCharacter(
   charId INT,
   hp INT,
   atk INT,
   spd INT,
   userId INT NOT NULL,
   PRIMARY KEY(charId),
   FOREIGN KEY(userId) REFERENCES MuUser(userId)
);



INSERT INTO `MuUser` (`username`, `email`, `hashPass`, `verifyToken`, `registerDate`) VALUES ('le_admin', 'admin@admin.com', '9be8af41689e5c7f4336f53f8e0c5f57.69429e2502e0b710ece5a43257aee7d308a23641f8954cfe8e193f003eed56af', NULL, '0')