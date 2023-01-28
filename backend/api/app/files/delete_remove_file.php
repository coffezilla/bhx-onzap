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
$fileId = addslashes(trim($_POST['file_id']));
$fileId = str_replace(" ", "", $fileId);

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean, $fileId);
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
            $queryFiles = mysqli_query($connection, "SELECT
            fil.fil_id,
            fil.fil_name
            FROM files AS fil
            WHERE fil.fil_id = '{$fileId}'
            AND fil.fil_status = 1") or die ("User Not Found");
            if (mysqli_num_rows ($queryFiles) > 0) { 

                // remove file
                $dataFile = mysqli_fetch_assoc($queryFiles);
                $fileName = $dataFile["fil_name"];

                $fileDirName = '../uploads/'.$fileName;

                if(unlink($fileDirName)) {
                    $dataResponse['message'] = "Success";
                } else {
                    $dataResponse['message'] = "Não deletado";                    
                }                

                // update
                mysqli_query($connection, "UPDATE files SET
                fil_status = 0
                WHERE fil_id = '{$fileId}'") or die("update error");

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
