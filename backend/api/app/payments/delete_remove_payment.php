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

            // procurar id se existe
            // get user data
            $queryPayments = mysqli_query($connection, "SELECT
            pay.pay_id
            FROM payments AS pay
            WHERE pay.pay_id = '{$paymentId}'
            AND (pay.pay_status = 1 OR pay.pay_status = 2)") or die ("User Not Found");
            if (mysqli_num_rows ($queryPayments) > 0) { 
                // deletar
                mysqli_query($connection, "UPDATE payments SET
                pay_status = 0
                WHERE pay_id = '{$paymentId}'") or die("update error");    

                // get user data
                $queryFiles = mysqli_query($connection, "SELECT
                fil.fil_id,
                fil.fil_name
                FROM files AS fil
                WHERE fil.pay_id = '{$paymentId}'
                AND fil.fil_status = 1") or die ("User Not Found");
                while($dataFile = mysqli_fetch_assoc($queryFiles)) {
                    
                    // remove file
                    $fileId = $dataFile["fil_id"];
                    $fileName = $dataFile["fil_name"];

                    $fileDirName = '../uploads/'.$fileName;

                    if(unlink($fileDirName)) {
                        $dataResponse['message'] = "Success";
                    } else {
                        $dataResponse['message'] = "Não deletado";                    
                    }                                    
                    // remove file

                    // update
                    mysqli_query($connection, "UPDATE files SET
                    fil_status = 0
                    WHERE fil_id = '{$fileId}'") or die("update error");

                }


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
