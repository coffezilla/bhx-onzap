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


// JWT auth 
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
            $dataResponse['files'] = array();

            // get user data
            $queryFiles = mysqli_query($connection, "SELECT
            fil.fil_id,
            fil.fil_name,
            fil.fil_title,
            fil.fil_due_date,
            fil.fil_value
            FROM files AS fil
            WHERE fil.pay_id = '{$paymentId}'
            AND fil.fil_status = 1") or die ("User Not Found");
            while($dataFile = mysqli_fetch_assoc($queryFiles)) {
                $dueDate = date_format(date_create_from_format('Y-m-d', $dataFile["fil_due_date"]), 'd/m/Y');
                array_push($dataResponse['files'], array(
                        "id" => $dataFile["fil_id"], 
                        "name" => $dataFile["fil_name"],
                        "title" => $dataFile["fil_title"],
                        "price" => $dataFile["fil_value"],

                        // 
                        "due_date" => $dueDate,
                        "charge_value" => $dataFile["fil_value"],
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
