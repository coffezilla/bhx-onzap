<?php 

header('Content-Type: application/json; charset=UTF-8');

include "../connect/bd_connect.php";
include "../helpers/utils.php";
include "../connect/auth.php";

//
$dataResponse = array();
$dataResponse['status'] = 0;
$dataResponse['message'] = '';
$errors = array();

// ========================================================
// AUTH BASIC
$userRole = addslashes(trim($_GET['role']));

$authTimestamp = addslashes(trim($_GET['auth_timestamp']));
$currentTimestampClean = str_replace(" ", "", $authTimestamp);

$authUserEmail = addslashes(trim($_GET['auth_email']));
$authUserEmail = str_replace(" ", "", $authUserEmail);

// ========================================================
// NEW VAR
$clientId = addslashes(trim($_GET['client_id']));
$clientId = str_replace(" ", "", $clientId);

$clientStatusArr = array("Ativo", "Desabilitado");

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean, $clientId);
$validInputs = checkEmptyData($checkers, 1);


// ========================================================


$JWTServerKeyCurrent = $userRole == 'ADMIN' ? $JWTServerkey : $JWTServerClientkey;

// JWT auth 
$isAuth = verifyAuth($clientToken, $JWTServerKeyCurrent);

if($isAuth && $userRole == 'ADMIN') {

    // check if email is the same as the token email
    if($validInputs) {
        // JWT auth
        $AuthUserData = getAuthorizatedUserData($connection, $authUserEmail, $currentTimestampClean, $JWTServerKeyCurrent, $clientToken, $userRole);
        if($AuthUserData['status'] == 1) {
            $userId = $AuthUserData['id'];

            // ========================================================

            $dataResponse['client'] = array();

            // get user data
            $queryClients = mysqli_query($connection, "SELECT
            cli.cli_id,
            cli.cli_name,
            cli.cli_service,
            cli.cli_email,
            cli.cli_status,
            cli.cli_cnpj,
            cli.cli_service_due_day,
            cli.cli_email_auto_sender
            FROM clients AS cli
            WHERE (cli.cli_status = 1 OR cli.cli_status = 2)
            AND cli.cli_id = '{$clientId}'") or die ("User Not Found");

            if (mysqli_num_rows ($queryClients) > 0) {
                while($dataClient = mysqli_fetch_assoc($queryClients)) {
                    $dataResponse['client'] = array(
                        "id" => $dataClient["cli_id"],
                        "name" => $dataClient["cli_name"],
                        "cnpj" => $dataClient["cli_cnpj"],
                        "service_due_date" => $dataClient["cli_service_due_day"],
                        "email_auto_sender" => $dataClient["cli_email_auto_sender"],

                        //
                        "service_description" => $dataClient["cli_service"],
                        "email" => $dataClient["cli_email"],
                        "service_status_number" => $dataClient["cli_status"],
                        "service_status_text" => $clientStatusArr[$dataClient["cli_status"]-1],

                    );
                }
                $dataResponse['status'] = 1;
            } else {
                $dataResponse['status'] = 2;
                $dataResponse['message'] = "Nothing found";
            }

            

            // ========================================================

        } else {
            $dataResponse['message'] = 'Usuário não autenticado';
            $dataResponse['status'] = 4;
        }
    } else {
        $dataResponse['message'] = 'Campo em branco';
        $dataResponse['status'] = 3;
    }
} else {
    // nao autehnticado
    $dataResponse['status'] = 2;
}

$resultadosJson = json_encode($dataResponse);
echo $resultadosJson;
