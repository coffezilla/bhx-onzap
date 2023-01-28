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
$userRole = addslashes(trim($_POST['role']));


$authTimestamp = addslashes(trim($_POST['auth_timestamp']));
$currentTimestampClean = str_replace(" ", "", $authTimestamp);

$authUserEmail = addslashes(trim($_POST['auth_email']));
$authUserEmail = str_replace(" ", "", $authUserEmail);

// ========================================================
// NEW VAR
$paymentId = addslashes(trim($_POST['payment_id']));
$paymentId = str_replace(" ", "", $paymentId);

// NEW VAR
$name = addslashes(trim($_POST['name']));
$dueDate = addslashes(trim($_POST['due_date']));
$dueDate = date_format(date_create_from_format('d/m/Y', $dueDate), 'Y-m-d');
$payStatus = addslashes(trim($_POST['status']));
$today = date("Y-m-d");
$priceBefore = addslashes(trim($_POST['price_before']));
$priceAfter = addslashes(trim($_POST['price_after']));
$payConfirmDate = addslashes(trim($_POST['payment_confirm_date']));
$payConfirmDate = date_format(date_create_from_format('d/m/Y', $payConfirmDate), 'Y-m-d');
$payNote = addslashes(trim($_POST['payment_confirm_note']));
$payConfirmPrice = addslashes(trim($_POST['payment_confirm_price']));

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean, $paymentId);
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

            // get user data
            $queryPayments = mysqli_query($connection, "SELECT
            pay.pay_id
            FROM payments AS pay
            WHERE pay.pay_id = '{$paymentId}'
            AND (pay.pay_status = 1 OR pay.pay_status = 2)") or die ("User Not Found");
            if (mysqli_num_rows ($queryPayments) > 0) {
                // update
                mysqli_query($connection, "UPDATE payments SET
                pay_hash = '{$name}',
                pay_status = '{$payStatus}',
                pay_due_date = '{$dueDate}',
                pay_price_before_due_date = '{$priceBefore}',
                pay_price_after_due_date = '{$priceAfter}',
                pay_confirm_date = '{$payConfirmDate}',
                pay_confirm_note = '{$payNote}',
                pay_confirm_price = '{$payConfirmPrice}'
                WHERE pay_id = '{$paymentId}'") or die("update error");

                $dataResponse['status'] = 1;
                $dataResponse['message'] = "Success";
            } else {
                $dataResponse['status'] = 2;
                $dataResponse['message'] = "Not found";
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
