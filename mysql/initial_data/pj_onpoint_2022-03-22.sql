# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.41)
# Database: pj_onpoint
# Generation Time: 2022-03-22 19:44:39 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



CREATE DATABASE `pj_onpoint`;
USE `pj_onpoint`;

# Dump of table app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `app`;

CREATE TABLE `app` (
  `app_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `app_name` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `app_url` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  PRIMARY KEY (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

LOCK TABLES `app` WRITE;
/*!40000 ALTER TABLE `app` DISABLE KEYS */;

INSERT INTO `app` (`app_id`, `app_name`, `app_url`)
VALUES
	(1,'onPoint - Área do cliente','https://www.cliente.bhxsites.com.br');

/*!40000 ALTER TABLE `app` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table clients
# ------------------------------------------------------------

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `cli_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cli_status` int(11) DEFAULT NULL,
  `cli_name` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_service` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_cnpj` int(50) DEFAULT NULL,
  `cli_cpf` varchar(20) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_name_full` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_email` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_pswd` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_email_auto_sender` int(11) DEFAULT NULL,
  `cli_service_due_day` int(11) DEFAULT NULL,
  `cli_short_name` varchar(3) COLLATE utf8_slovenian_ci DEFAULT NULL,
  PRIMARY KEY (`cli_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;

INSERT INTO `clients` (`cli_id`, `cli_status`, `cli_name`, `cli_service`, `cli_cnpj`, `cli_cpf`, `cli_name_full`, `cli_email`, `cli_pswd`, `cli_email_auto_sender`, `cli_service_due_day`, `cli_short_name`)
VALUES
	(1,1,'zFamet','Site + Marketing',123123,'222','Famet LTDA','xx@gmail.com','202cb962ac59075b964b07152d234b70',2,1,'FAM'),
	(2,1,'zJoelba','Loja Virtual + E-commerce + Gerenciamento',123123,'333','Joelba Companhia do Papel','renato@bhxsites.com.br','202cb962ac59075b964b07152d234b70',2,2,'JOE'),
	(3,1,'zTim Tim Copos','Loja Virtual',123123,'333','Tim Tim Copos','contato@gmail.com','202cb962ac59075b964b07152d234b70',2,3,'TIM'),
	(4,1,'BHX Sites','Tudo',123123,'444','BHX Sites','renato@bhxsites.com.br','202cb962ac59075b964b07152d234b70',1,4,'BHX');

/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table files
# ------------------------------------------------------------

DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
  `fil_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fil_status` int(11) DEFAULT NULL,
  `fil_name` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `fil_title` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `pay_id` int(11) DEFAULT NULL,
  `fil_due_date` date DEFAULT NULL,
  `fil_value` varchar(11) COLLATE utf8_slovenian_ci DEFAULT NULL,
  PRIMARY KEY (`fil_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;

INSERT INTO `files` (`fil_id`, `fil_status`, `fil_name`, `fil_title`, `pay_id`, `fil_due_date`, `fil_value`)
VALUES
	(1,1,'cc9cb7b9da86db55b5c5114beffc2de0.pdf','Boleto',1,'2022-01-20','100,00'),
	(2,1,'35144df1748e9fa2c16bd5ba7fd249ab.pdf','Boleto',2,'2022-02-20','100,00'),
	(3,1,'ba05a11481f4531230601d8dc6c01efa.pdf','Boleto',3,'2022-03-20','100,00'),
	(4,1,'4e49cc8e7e00daadc278453f69f17d2f.pdf','Boleto2',3,'2022-03-20','100,00'),
	(5,1,'0833a83f65805e6303e3758c00e7c1e5.pdf','Boleto',7,'2022-03-20','90,90'),
	(6,0,'3226db3904eb598d75911221bf4e9030.pdf','Boleto',8,'2022-03-20','123,12'),
	(7,1,'d6a3b2c4438b60c26b2e93b04cd2ae53.pdf','Boleto',14,'2022-11-24','1'),
	(8,1,'72585ab24897a3afa7a16185bbbdcdc9.pdf','Boleto',12,'2022-03-23','1'),
	(9,1,'300123451ea98dab61f01d0432f7e4ab.pdf','Boleto',11,'2022-03-22','1'),
	(10,1,'4a2f6bfb5085a26a28e8c10c041713c2.pdf','Boleto',17,'2022-03-22','1'),
	(11,1,'7d57a8fccc356db75e904717fb48262e.pdf','Boleto',10,'2022-03-21','1'),
	(12,1,'022ea8a9a8cbf8990b2073ff4caf041d.pdf','Boleto',16,'2022-03-21','1'),
	(13,1,'e87523a9d88259dc759a7855f5c75cb2.pdf','Boleto',9,'2022-03-20','1'),
	(14,1,'4e2a94491e5285f25e0a15148da919f6.pdf','Boleto',15,'2022-03-20','1'),
	(15,1,'bb90ca6b7b9a82203478e34d93331c62.pdf','Boleto',13,'2022-03-18','1'),
	(16,0,'d3f87c7063f1bb21ef33ea83fbd39dcf.pdf','Boleto',19,'2022-03-26','1');

/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `info`;

CREATE TABLE `info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;



# Dump of table payments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `pay_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pay_status` int(11) DEFAULT NULL,
  `cli_id` int(11) DEFAULT NULL,
  `pay_hash` varchar(100) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `pay_due_date` date DEFAULT NULL,
  `pay_date_create` date DEFAULT NULL,
  `pay_price_before_due_date` varchar(11) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `pay_price_after_due_date` varchar(11) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `pay_confirm_date` date DEFAULT NULL,
  `pay_confirm_note` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `pay_confirm_price` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `pay_send_status` int(11) DEFAULT NULL,
  `pay_send_date` date DEFAULT NULL,
  PRIMARY KEY (`pay_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;

INSERT INTO `payments` (`pay_id`, `pay_status`, `cli_id`, `pay_hash`, `pay_due_date`, `pay_date_create`, `pay_price_before_due_date`, `pay_price_after_due_date`, `pay_confirm_date`, `pay_confirm_note`, `pay_confirm_price`, `pay_send_status`, `pay_send_date`)
VALUES
	(1,2,1,'Mensalidade jan 22','2022-01-20','2022-03-18','100,00','100,00','0000-00-00','','100,00',1,'2022-03-18'),
	(2,2,1,'Mensalidade Fev 22','2022-02-20','2022-03-18','100,00','100,00','0000-00-00','','100,00',1,'2022-03-18'),
	(3,2,1,'Mensalidade Mar 22','2022-03-20','2022-03-18','100,00','100,00','0000-00-00','','100,00',1,'2022-03-18'),
	(4,1,1,'Mensalidade Abr 22','2022-04-20','2022-03-18','100,00','100,00','2022-04-20','asdfasfd','100,00',1,'2022-03-18'),
	(5,2,1,'Mensalidade Mai 22','2022-05-20','2022-03-18','100,00','100,00','0000-00-00','','100,00',1,'2022-03-18'),
	(6,2,1,'Mensalidade Jun 22','2022-06-20','2022-03-18','100,00','100,00','0000-00-00','','100,00',1,'2022-03-18'),
	(7,2,2,'Mensalidade Mar','2022-03-20','2022-03-18','90,90','90,99','0000-00-00','','90,90',1,'2022-03-18'),
	(8,0,4,'Mensalidade','2022-03-20','2022-03-18','123,12','123,12','0000-00-00','','123,12',1,'2022-03-18'),
	(9,1,4,'Mensalidade 1','2022-03-16','2022-03-16','1','1','2022-03-16','','1',1,'2022-03-18'),
	(10,1,4,'Mensalidade 2','2022-03-18','2022-03-18','1','1','2022-03-18','','1',2,'2022-03-18'),
	(11,1,4,'Mensalidade 3','2022-03-22','2022-03-18','1','1','2022-03-22','','1',2,'2022-03-18'),
	(12,1,4,'Mensalidade 4','2022-03-23','2022-03-18','1','1','2022-03-23','','1',1,'2022-03-18'),
	(13,1,4,'Mensalidade 0','2022-03-18','2022-03-18','1','1','2022-03-18','','1',1,'2022-03-18'),
	(14,1,4,'Mensalidade 5','2022-03-24','2022-03-18','1','1','0000-00-00','','1',2,'2022-03-21'),
	(15,1,4,'Mensalidade 1b','2022-03-20','2022-03-18','1','1','2022-03-18','','1',1,'2022-03-18'),
	(16,1,4,'Mensalidade 2b','2022-03-21','2022-03-18','1','1','2022-03-18','','1',1,'2022-03-18'),
	(17,1,4,'Mensalidade 3b','2022-03-22','2022-03-18','1','1','2022-03-18','','1',1,'2022-03-18'),
	(18,2,4,'Mensalidade 6','2022-03-25','2022-03-18','1','1','2022-03-25','','1',2,'2022-03-21'),
	(19,0,4,'Mensalidade 7b','2022-03-26','2022-03-18','1','1','2022-03-26','','1',2,'2022-03-21'),
	(20,2,3,'Mensalidade','1989-12-12','2022-03-22','1','1','0000-00-00','','1',1,'0000-00-00');

/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `usr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `usr_status` int(11) DEFAULT NULL,
  `usr_name` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `usr_last_name` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `usr_email` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `usr_password` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `usr_pin_recovery` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`usr_id`, `usr_status`, `usr_name`, `usr_last_name`, `usr_email`, `usr_password`, `usr_pin_recovery`)
VALUES
	(1,1,'Boss','Santo','foo@gmail.com','202cb962ac59075b964b07152d234b70','0');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
