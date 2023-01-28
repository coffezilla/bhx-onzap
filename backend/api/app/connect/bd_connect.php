<?php 

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Authorization');

	//conecta ao banco
	error_reporting(0);
	date_default_timezone_set('America/Sao_Paulo');
		
	//busca dados do MySql
	require_once "functionData_offline.php";

	//connection OFFLINE
	$hostname = bd_hostname();
	$username = bd_username();
	$password = bd_password();
	$database = bd_galeria();
	$JWTServerkey = jwt_key();
	$JWTServerClientkey = jwt_client_key();
	$httpHeaderData = apache_request_headers();

	// BUG Apache: need to check if is getting from capitalized or not
	$clientToken = isset($httpHeaderData['authorization']) ? $httpHeaderData['authorization'] : $httpHeaderData['Authorization'];

	//Conexão mysql
	$connection = mysqli_connect($hostname, $username, $password, $database) or die ("Erro na conexão do banco de dados.");

	//Seleciona o banco de dados
	mysqli_set_charset($connection, 'UTF8');	//faz connection usando UTF 8

?>