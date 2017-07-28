DROP SCHEMA IF EXISTS art2;

CREATE DATABASE art2;

USE art2;

DROP TABLE IF EXISTS `paintings`;

CREATE TABLE `paintings` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `movement` varchar(50) NOT NULL,
  `artist` varchar(50) NOT NULL,
  `yearCreated` char(4) DEFAULT NULL,
  `museumName` varchar(50) DEFAULT NULL,
  `museumLocation` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;




LOCK TABLES `paintings` WRITE;

INSERT INTO `paintings` VALUES (1,'The Starry Night','post-impressionism','Vincent Van Gogh','1989','Museum of Modern Art','New York'),(2,'Water Lilies Nympheas','impressionism','Claude Monet','1907','Art Gallery of Ontario','Toronto'),(5,'Guernica','surrealism','Pablo Picasso','1937','Museo Navional Centro','Madrid'),(6,'Bal du moulin','impressionism','Pierre-Auguste-Renoires','1976','Musee d\' Orsay','Paris'),(7,'Mona Lisa','renaissance','Leonardo da Vinci','1965','Smithsonian','Washington'),(8,'Dogs Playing Poker','renaissance','Rob Royson','1998','basement','Charleston'),(14,'The Bal pu whips de la Fites','impressionism','Pierre-Auguste Renoires',NULL,'',''),(15,'The Bal pu whips de la petiete','impressionism','Pierre-Auguste Renoires','1876','','');

UNLOCK TABLES;
