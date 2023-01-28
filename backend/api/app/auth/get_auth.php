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

// var
$userRole = addslashes(trim($_GET['role']));

$userEmail = addslashes(trim($_GET['auth_email']));
$userEmail = str_replace(" ", "", $userEmail);

$currentTimestamp = Date('Y-m-d H:i:s');
$currentTimestampClean = str_replace(" ", "", $currentTimestamp);

// verify
$checkers = array($userEmail, $currentTimestamp);
$validInputs = checkEmptyData($checkers, 1);


$JWTServerKeyCurrent = $userRole == 'ADMIN' ? $JWTServerkey : $JWTServerClientkey;

// JWT auth 
$isAuth = verifyAuth($clientToken, $JWTServerKeyCurrent);

// $token = createJWTAuth($userEmail, $currentTimestampClean, $JWTServerKeyCurrent);


if($isAuth) {
    if($validInputs) {

        // if is not logged clean the field email
        if($userEmail == 'NOT_LOGGED') {
            $dataResponse['email'] = '';
        } else {
            $dataResponse['email'] = $userEmail;
        }
        $dataResponse['token'] = $clientToken;
        $dataResponse['timestamp'] = $currentTimestamp;
        $dataResponse['status'] = 1;
        $dataResponse['role'] = $userRole;
    } else {
        $dataResponse['message'] = 'Campo em branco';
        $dataResponse['status'] = 2;    
    }
} else {
    $dataResponse['message'] = 'Not Auth';
    $dataResponse['status'] = 3;
}


$resultadosJson = json_encode($dataResponse);
echo $resultadosJson;
