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

$today = date("Y-m-d");

// ========================================================
// NEW VAR

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean);
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
            $dataResponse['clients'] = array();

            // status_number: 1=pago ; 2=aguardando ; 3=vencido

            // resume payments
            // get user data
            // $lastCharge = '';
            // $queryPayments = mysqli_query($connection, "SELECT
            // pay.pay_due_date
            // FROM payments AS pay
            // WHERE pay.cli_id = 3
            // AND (pay.pay_status = 1 OR pay.pay_status = 2)
            // AND pay.pay_due_date < CURDATE()
            // LIMIT 1") or die ("User Not Found");
            // if (mysqli_num_rows ($queryPayments) > 0) {
            //     $dataPayment = mysqli_fetch_assoc($queryPayments);
            //     $lastCharge = $dataPayment['pay_due_date'];
            // }


            // get user data
            $queryClients = mysqli_query($connection, "SELECT
            cli.cli_id,
            cli.cli_name
            FROM clients AS cli
            WHERE (cli.cli_status = 1 OR cli.cli_status = 2)") or die ("User Not Found");

            while($dataClient = mysqli_fetch_assoc($queryClients)) {

                $clientId = $dataClient["cli_id"];
                $clientStatusText = 'Aguardando pagamento';
                $clientStatusNumber = 3;

                // get last charge, next charge and current if available
                $lastCharge = '';
                $queryPayments = mysqli_query($connection, "SELECT
                pay.pay_due_date
                FROM payments AS pay
                WHERE pay.cli_id = '{$clientId}'
                AND (pay.pay_status = 1 OR pay.pay_status = 2)
                AND pay.pay_due_date < CURDATE()
                ORDER BY pay_due_date DESC
                LIMIT 1") or die ("User Not Found");
                if (mysqli_num_rows ($queryPayments) > 0) {
                    $dataPayment = mysqli_fetch_assoc($queryPayments);
                    $lastCharge = $dataPayment['pay_due_date'];
                    $lastCharge = date_format(date_create_from_format('Y-m-d', $lastCharge), 'd/m/Y');
                }


                // get last charge, next charge and current if available
                $nextCharge = '';
                $queryPayments = mysqli_query($connection, "SELECT
                pay.pay_due_date
                FROM payments AS pay
                WHERE pay.cli_id = '{$clientId}'
                AND (pay.pay_status = 1 OR pay.pay_status = 2)
                AND pay.pay_due_date >= CURDATE()
                ORDER BY pay_due_date
                LIMIT 1") or die ("User Not Found");
                if (mysqli_num_rows ($queryPayments) > 0) {
                    $dataPayment = mysqli_fetch_assoc($queryPayments);
                    $nextCharge = $dataPayment['pay_due_date'];
                    $nextCharge = date_format(date_create_from_format('Y-m-d', $nextCharge), 'd/m/Y');
                }

                // get last charge, next charge and current if available
                $openedCharge = array();
                $queryPayments = mysqli_query($connection, "SELECT
                pay.pay_due_date
                FROM payments AS pay
                WHERE pay.cli_id = '{$clientId}'
                AND (pay.pay_status = 2 AND pay.pay_due_date <= DATE_ADD(CURDATE(), INTERVAL 5 DAY))
                ORDER BY pay_due_date DESC") or die ("User Not Found");
                if (mysqli_num_rows ($queryPayments) > 0) {
                    while($dataPayment = mysqli_fetch_assoc($queryPayments)) {
                        // $openedCharge = $dataPayment['pay_due_date'];
                        $dueDate = $dataPayment['pay_due_date'];
                        $currentDate = date_format(date_create_from_format('Y-m-d', $dueDate), 'd/m/Y');
                        array_push($openedCharge, $currentDate);

                        if($today <= $dueDate) {
                            $clientStatusText = "Aguardando";
                            $clientStatusNumber = 2;
                        } else {
                            $clientStatusText = "Atrasado";
                            $clientStatusNumber = 3;                            
                        }

                    }

                } else {
                    $clientStatusText = "Pagamento em dia";
                    $clientStatusNumber = 1;

                }


                array_push($dataResponse['clients'], array(
                        "id" => $clientId,
                        "name" => $dataClient["cli_name"],
                        "last_charge" => $lastCharge,
                        "next_charge" => $nextCharge,
                        "opened_charge" => $openedCharge,
                        "status_text" => $clientStatusText,
                        "status_number" => $clientStatusNumber,
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
