DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `genero_id` int(11) unsigned NULL,
  `director_id` int(11) unsigned NULL,
  `actor_id` int(11) unsigned NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `voto`;

CREATE TABLE `voto` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `competencia_id` int(11) unsigned NOT NULL,
  `pelicula_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `competencia_id_voto` (`competencia_id`),
  KEY `pelicula_id_voto` (`pelicula_id`),
  CONSTRAINT `competencia_id_voto` FOREIGN KEY (`competencia_id`) REFERENCES `competencia` (`id`),
  CONSTRAINT `pelicula_id_voto` FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;