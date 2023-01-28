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

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean, $clientId);
$validInputs = checkEmptyData($checkers, 1);

$clientStatusArr = array("Pago", "Aguardando", "Atrasado");
$paySendStatusArr = array("Não enviado","Enviado");

// ========================================================

function getStatusPayment ($statusPayment, $dueDate) {
    $today = date("Y-m-d");
    $dayAvailableToPay = date('Y-m-d', strtotime($today. ' + 5 days'));

    // paied
    if($statusPayment == 1) {
        return array(1, "Pago");
    } else {

        if($today <= $dueDate) {
            if($dueDate <= $dayAvailableToPay) {
                return array(2, "Aguardando");
            } else {
                return array(4, "Não disponível");
            }
        } else {
            return array(3, "Atrasado");
        }
    }
}


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
            $dataResponse['payments'] = array();

            // charge_status_number: 1=pago ; 2=aguardando ; 3=vencido
            // pay_status: 1=pago ; 2=disponível ; 3=deletado

            // get user data
            $queryPayments = mysqli_query($connection, "SELECT
            pay.pay_id,
            pay.pay_hash,
            pay.pay_date_create,
            pay.pay_due_date,
            pay.pay_status,
            pay.pay_ref,
            pay.pay_send_status,
            cli.cli_short_name,
            cli.cli_cnpj,
            cli.cli_cpf,
            cli.cli_email               
            FROM payments AS pay
            INNER JOIN clients AS cli ON cli.cli_id = pay.cli_id
            WHERE pay.cli_id = '{$clientId}'
            AND (pay.pay_status = 1 OR pay.pay_status = 2)
            ORDER BY pay_due_date DESC") or die ("User Not Found");


            while($dataPayment = mysqli_fetch_assoc($queryPayments)) {

                $ticketsFiles = array();
                $paymentId = $dataPayment["pay_id"];
                $paySendStatusNumber = $dataPayment["pay_send_status"];
                $paySendStatusText = $paySendStatusArr[$dataPayment["pay_send_status"]-1];

                // get user data
                $queryFiles = mysqli_query($connection, "SELECT
                fil.fil_id,
                fil.fil_name,
                fil.fil_title
                FROM files AS fil
                WHERE fil.pay_id = '{$paymentId}'
                AND fil.fil_status = 1") or die ("User Not Found");
                while($dataFile = mysqli_fetch_assoc($queryFiles)) {
                    array_push($ticketsFiles, array(
                            "id" => $dataFile["fil_id"], 
                            "name" => $dataFile["fil_name"],
                            "title" => $dataFile["fil_title"]
                        )
                    );
                }                


                $emitedDate = date_format(date_create_from_format('Y-m-d', $dataPayment["pay_date_create"]), 'd/m/Y');
                $dueDate = date_format(date_create_from_format('Y-m-d', $dataPayment["pay_due_date"]), 'd/m/Y');


                array_push($dataResponse['payments'], array(
                        "id" => $paymentId,
                        "ref" => $dataPayment["pay_ref"],
                        "name" => $dataPayment["pay_hash"],
                        "emited_date" => $emitedDate,
                        "due_date" => $dueDate,
                        "email_sended_text" => $paySendStatusText,
                        "email_sended_number" => $paySendStatusNumber,
                        "charge_status_number" => getStatusPayment($dataPayment["pay_status"], $dataPayment["pay_due_date"])[0],
                        "charge_status_text" => getStatusPayment($dataPayment["pay_status"], $dataPayment["pay_due_date"])[1],
                        "ticket_files" => $ticketsFiles
                    )
                );
            }

            $dataResponse['status'] = 1;

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
