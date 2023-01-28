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
$paymentId = addslashes(trim($_GET['payment_id']));
$paymentId = str_replace(" ", "", $paymentId);

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean, $paymentId);
$validInputs = checkEmptyData($checkers, 1);


// ========================================================

function getStatusPayment ($statusPayment, $dueDate) {
    $today = date("Y-m-d");
    // paied
    if($statusPayment == 1) {
        return array(1, "Pago");
    } else {
        if($today <= $dueDate) {
            return array(2, "Aguardando");
        } else {
            return array(3, "Atrasado");
        }
    }
}

$JWTServerKeyCurrent = $userRole == 'ADMIN' ? $JWTServerkey : $JWTServerClientkey;

// JWT auth 
$isAuth = verifyAuth($clientToken, $JWTServerKeyCurrent);

if($isAuth && $userRole == 'CLIENT') {

    // check if email is the same as the token email
    if($validInputs) {
        // JWT auth
        $AuthUserData = getAuthorizatedUserData($connection, $authUserEmail, $currentTimestampClean, $JWTServerKeyCurrent, $clientToken, $userRole);
        if($AuthUserData['status'] == 1) {
            $clientId = $AuthUserData['id'];



            // ========================================================
            $dataResponse['payment'] = array();

            // charge_status_number: 1=pago ; 2=aguardando ; 3=vencido
            // pay_status: 1=pago ; 2=disponível ; 3=deletado

            // get user data
            $queryPayments = mysqli_query($connection, "SELECT
            pay.pay_id,
            pay.pay_hash,
            pay.cli_id,
            pay.pay_status,
            pay.pay_due_date,
            pay.pay_price_before_due_date,
            pay.pay_price_after_due_date,
            pay.pay_due_date,
            pay.pay_confirm_date,
            pay.pay_confirm_note,
            pay.pay_confirm_price,
            pay.pay_ref,
            cli.cli_cnpj,
            cli.cli_cpf,
            cli.cli_short_name
            FROM payments AS pay
            INNER JOIN clients AS cli ON cli.cli_id = pay.cli_id
            WHERE pay.pay_id = '{$paymentId}'
            AND pay.cli_id = '{$clientId}'
            AND (pay.pay_status = 1)") or die ("User Not Found");
            if (mysqli_num_rows ($queryPayments) > 0) {

                while($dataPayment = mysqli_fetch_assoc($queryPayments)) {

                    // service and client data
                    $clientService = '';
                    $clientName = '';
                    $queryClients = mysqli_query($connection, "SELECT
                    cli.cli_service,
                    cli.cli_name
                    FROM clients AS cli
                    WHERE cli.cli_id = '{$clientId}'") or die ("User Not Found");

                    $dataClient = mysqli_fetch_assoc($queryClients);
                    $clientService = $dataClient['cli_service'];
                    $clientName = $dataClient['cli_name'];


                    $emitedDate = date_format(date_create_from_format('Y-m-d', $dataPayment["pay_date_create"]), 'd/m/Y');
                    $dueDate = date_format(date_create_from_format('Y-m-d', $dataPayment["pay_due_date"]), 'd/m/Y');                    
                    $payConfirmDate = date_format(date_create_from_format('Y-m-d', $dataPayment["pay_confirm_date"]), 'd/m/Y');                    

                
                    $dataResponse['payment'] = array(
                        "id" => $clientId,
                        "ref" => $dataPayment["pay_ref"],
                        "today" => date("d/m/Y"),
                        "name" => $dataPayment["pay_hash"],
                        "cnpj" => $dataPayment["cli_cnpj"],
                        "cpf" => $dataPayment["cli_cpf"],
                        "client_id" => $dataPayment["cli_id"],
                        "client_name" => $clientName,
                        "status" => $dataPayment["pay_status"],

                        "emited_date" => $emitedDate,
                        "due_date" => $dueDate,
                        "ticket_files" => $ticketsFiles,

                        //
                        "charge_status_number" => getStatusPayment($dataPayment["pay_status"], $dataPayment["pay_due_date"])[0],
                        "charge_status_text" => getStatusPayment($dataPayment["pay_status"], $dataPayment["pay_due_date"])[1],
                        "service_description" => $clientService,
                        "price_before_due_date" => $dataPayment["pay_price_before_due_date"],
                        "price_after_due_date" => $dataPayment["pay_price_after_due_date"],
                        
                        "price_paid" => $dataPayment["pay_confirm_price"],
                        "payment_date" => $payConfirmDate,
                        "note" => $dataPayment["pay_confirm_note"],
                     
                    );
                }

                $dataResponse['status'] = 1;
            } else {
                $dataResponse['status'] = 2;
                $dataResponse['message'] = 'Nothing found';
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
