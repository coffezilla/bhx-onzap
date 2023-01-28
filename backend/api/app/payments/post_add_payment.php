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
$clientId = addslashes(trim($_POST['client_id']));
$clientId = str_replace(" ", "", $clientId);

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
$payConfirmPrice = $payStatus == 1 ? addslashes(trim($_POST['payment_confirm_price'])) : $priceBefore ;



// get user data
$queryClient = mysqli_query($connection, "SELECT
cli.cli_short_name,
(SELECT COUNT(pay.pay_id) FROM payments AS pay WHERE pay.cli_id = 1) AS current_id
FROM clients AS cli
WHERE cli.cli_id = '{$clientId}'") or die ("User Not Found");
if (mysqli_num_rows ($queryClient) > 0) {
    $dataClient = mysqli_fetch_assoc($queryClient);
    $clientShortName = $dataClient['cli_short_name'];
    $paymentCurrent = $dataClient['current_id'];
}

// ref
$dataRef = date('ym', strtotime($dueDate));
$payIdFull = str_pad($paymentCurrent,3, "0", STR_PAD_LEFT);
$payRef = $clientShortName.$dataRef.$payIdFull;

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean, $clientId, $name);
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

            // upload photos
            mysqli_query($connection, "INSERT INTO payments VALUES (
            '',
            '{$payStatus}',
            '{$payRef}',
            '{$clientId}',
            '{$name}',
            '{$dueDate}',
            '{$today}',
            '{$priceBefore}',
            '{$priceAfter}',
            '{$payConfirmDate}',
            '{$payNote}',
            '{$payConfirmPrice}',
            1,
            '');") or die("erro sign up");                


            $dataResponse['status'] = 1;
            $dataResponse['message'] = "Success";


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
