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
	(1,'--','xx');

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
  `cli_cnpj` varchar(50) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_cpf` varchar(20) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_name_full` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_email` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_pswd` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_email_auto_sender` int(11) DEFAULT NULL,
  `cli_service_due_day` int(11) DEFAULT NULL,
  `cli_short_name` varchar(3) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_whatsapp` varchar(11) COLLATE utf8_slovenian_ci DEFAULT NULL,
  PRIMARY KEY (`cli_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;



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



# Dump of table info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `info`;

CREATE TABLE `info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;



# Dump of table messages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `msg_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `msg_status` int(11) DEFAULT NULL,
  `msg_text` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
  `cli_id` int(11) DEFAULT NULL,
  `msg_answer_to` int(11) DEFAULT NULL,
  `msg_key_text` varchar(20) COLLATE utf8_slovenian_ci DEFAULT NULL,
  PRIMARY KEY (`msg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;

INSERT INTO `messages` (`msg_id`, `msg_status`, `msg_text`, `cli_id`, `msg_answer_to`, `msg_key_text`)
VALUES
	(1,1,'Olá, o que você gostaria?',4,0,'');

/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table payments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `pay_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pay_status` int(11) DEFAULT NULL,
  `pay_ref` varchar(200) COLLATE utf8_slovenian_ci DEFAULT NULL,
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
	(1,1,'Administrator','Renato','renato@gmail.com','202cb962ac59075b964b07152d234b70','0');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users_
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_`;

CREATE TABLE `users_` (
  `u_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `u_nome` varchar(255) DEFAULT NULL,
  `u_email` varchar(255) DEFAULT NULL,
  `u_email_profissional` varchar(255) DEFAULT NULL,
  `u_tel` varchar(20) DEFAULT NULL,
  `u_celular` varchar(20) DEFAULT NULL,
  `u_subs` date DEFAULT NULL,
  `u_cep` varchar(15) DEFAULT NULL,
  `u_rua` varchar(150) DEFAULT NULL,
  `u_numero` varchar(3) DEFAULT NULL,
  `u_bairro` varchar(100) DEFAULT NULL,
  `u_cidade` varchar(100) DEFAULT NULL,
  `u_uf` varchar(100) DEFAULT NULL,
  `u_complemento` varchar(150) DEFAULT NULL,
  `u_pass` varchar(255) DEFAULT NULL,
  `u_acesso` int(3) DEFAULT NULL,
  `u_newsletter_ok` int(2) DEFAULT NULL,
  `u_grupo` int(11) DEFAULT NULL,
  `u_rg` varchar(15) DEFAULT NULL,
  `u_sexo` varchar(20) DEFAULT NULL,
  `u_cpf` varchar(20) DEFAULT NULL,
  `u_nascimento` date DEFAULT NULL,
  `u_facebook` varchar(100) DEFAULT NULL,
  `u_cargo` varchar(100) DEFAULT NULL,
  `u_setor` varchar(100) DEFAULT NULL,
  `u_empresa` varchar(200) DEFAULT NULL,
  `u_observacoes` text,
  `u_status` smallint(1) DEFAULT NULL,
  PRIMARY KEY (`u_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
