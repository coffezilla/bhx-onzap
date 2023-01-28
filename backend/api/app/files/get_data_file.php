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
$fileId = addslashes(trim($_GET['file_id']));
$fileId = str_replace(" ", "", $fileId);

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean, $fileId);
$validInputs = checkEmptyData($checkers, 1);


// ========================================================


// JWT auth 
$JWTServerKeyCurrent = $userRole == 'ADMIN' ? $JWTServerkey : $JWTServerClientkey;
$isAuth = verifyAuth($clientToken, $JWTServerKeyCurrent);

if($isAuth && $userRole == 'ADMIN') {

    // check if email is the same as the token email
    if($validInputs) {
        // JWT auth
        $AuthUserData = getAuthorizatedUserData($connection, $authUserEmail, $currentTimestampClean, $JWTServerKeyCurrent, $clientToken, $userRole);
        if($AuthUserData['status'] == 1) {
            $userId = $AuthUserData['id'];


            // ========================================================
            $dataResponse['file'] = array();

            // get user data
            $queryFiles = mysqli_query($connection, "SELECT
            fil.fil_id,
            fil.fil_name,
            fil.fil_title
            FROM files AS fil
            WHERE fil.fil_id = '{$fileId}'
            AND fil.fil_status = 1") or die ("User Not Found");
            if (mysqli_num_rows ($queryFiles) > 0) {
                while($dataFile = mysqli_fetch_assoc($queryFiles)) {
                    $dataResponse['file'] =array(
                        "id" => $dataFile["fil_id"], 
                        "name" => $dataFile["fil_name"],
                        "title" => $dataFile["fil_title"],
                        
                        //
                        // "emited_date" => "12/12/1212", 
                        // "due_date" => "12/12/1212",
                        // "charge_status_number" => 1,
                        // "charge_status_text" => "Pago",
                        // "has_ticket_file" => true,
                        // "fil_id" => 1,
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
