<?php 

header('Content-Type: application/json; charset=UTF-8');

include "../connect/bd_connect.php";
include "../helpers/utils.php";
// include '../assets/WideImage/WideImage.php';
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

$title = addslashes(trim($_POST['title']));
$dueDate = addslashes(trim($_POST['due_date']));
$dueDate = date_format(date_create_from_format('d/m/Y', $dueDate), 'Y-m-d');
$value = addslashes(trim($_POST['price']));

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

            // upload file
            // NEW VAR
            $fileUpload = $_FILES['file'];
            $fileDirName = '../uploads/';

            // file upload
            if (!empty($fileUpload["name"])) {

                $fileExtension = strtolower(end(explode('.', $fileUpload['name'])));
                $fileSize = $fileUpload['size'];
                $fileName = $fileUpload['name'];
                $haveError = false;

                // requiremnt
                $reqFileMax = 1024 * 1024 * 5; // 2Mb
                $reqFileExtensions = array('pdf');
                $reqFileRename = true;

                if ($documentoInput['error'] != 0) {
                    $haveError = true;
                }

                if (array_search($fileExtension, $reqFileExtensions) === false) {
                    $haveError = true;
                }

                if ($reqFileMax < $fileSize) {
                    $haveError = true;
                }

                if ($reqFileRename) {
                    $fileNewName = md5(time()).'.'.$fileExtension;
                } else {
                    $fileNewName = $fileName;
                }

                if(!$haveError) {

                
                    $dataResponse["message"] = "Sem erro de upload"; 
                    // Depois verifica se é possível mover o arquivo para a pasta escolhida
                    if (move_uploaded_file($fileUpload['tmp_name'], $fileDirName . $fileNewName)) {
                        mysqli_query($connection, "INSERT INTO files VALUES (
                        '',
                        1,
                        '{$fileNewName}',
                        '{$title}',
                        '{$paymentId}',
                        '{$dueDate}',
                        '{$value}');") or die("erro sign up");

                        $dataResponse['status'] = 1;
                        $dataResponse['message'] = "Success";
                    } else {
                        $dataResponse['status'] = 2;
                        $dataResponse['message'] = "Erro up";
                    }
                } else {

                    $dataResponse['status'] = 2;
                    $dataResponse["message"] = "Nao deu upload"; 

                }
            } else {
                $dataResponse['status'] = 3;
                $dataResponse["message"] = "Arquivo upload nao encontrado";
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
