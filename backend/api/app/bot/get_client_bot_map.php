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
// $clientId = 1;
// $clientId = str_replace(" ", "", $clientId);

// ========================================================
// CHECKING VALIDATION

// verify
$checkers = array($authUserEmail, $currentTimestampClean);
$validInputs = checkEmptyData($checkers, 1);

$clientStatusArr = array("Pago", "Aguardando", "Atrasado");

// ========================================================

function getStatusPayment ($statusPayment, $dueDate) {
    $today = date("Y-m-d");
    // paied
    if($statusPayment == 1) {
        return array(1, "Pago");
    } else {
        if($today <= $dueDate) {
            return array(2, "Aguardando pagamento");
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
            $dataResponse['botmap'] = array();

            // charge_status_number: 1=pago ; 2=aguardando ; 3=vencido
            // pay_status: 1=pago ; 2=disponível ; 3=deletado

            // get user data
            $queryBotmap = mysqli_query($connection, "SELECT
            msg.msg_id,
            msg.msg_text,
            msg.msg_status,
            msg.cli_id,
            msg.msg_answer_to,
            msg.msg_key_text
            FROM messages AS msg
            INNER JOIN clients AS cli ON cli.cli_id = msg.cli_id
            WHERE cli.cli_status = 1
            AND msg.msg_status = 1
            AND msg.cli_id = '{$clientId}'
            ORDER BY msg.msg_answer_to, msg.msg_id  ") or die ("User Not Found");

            // 
            $level = 0;
            $rootLevelStructure = array();  // root level
            $levelStructure = array();  // structure for level

            while($dataBotmap = mysqli_fetch_assoc($queryBotmap)) {

                $goToNextLevel = hasToChangeLevel($dataBotmap["msg_answer_to"], $levelStructure);

                // check if has to change level
                if($goToNextLevel) {
                    array_push($rootLevelStructure, $levelStructure);
                    $level = $dataBotmap["msg_answer_to"];
                    $levelStructure = array();
                }

                array_unshift($levelStructure,
                    array(
                        "id" => $dataBotmap["msg_id"],
                        "title" => $dataBotmap["msg_text"],
                        "answerTo" => $dataBotmap["msg_answer_to"],
                        "keyText" => $dataBotmap["msg_key_text"],
                    )
                );
            }

            // end
            array_push($rootLevelStructure, $levelStructure);
            $level = $dataBotmap["msg_answer_to"];
            $levelStructure = array();

            // if($level < $dataBotmap["msg_answer_to"]) {
            //     array_push($rootLevelStructure, $levelStructure);
            //     $level = $dataBotmap["msg_answer_to"];
            //     $levelStructure = array();
            // }


            
            // // 
            $dataResponse['botmap'] = $rootLevelStructure;
            //     array(
            //         array(
            //             "id" => $dataPayment[""],
            //             "title" => $dataPayment[""],
            //             "answerTo" => $dataPayment[""],
            //             "keyText" => $dataPayment[""],
            //         ),
            //     ),
            //     array(
            //         array(
            //             "id" => 2,
            //             "title" => "Opt 1",
            //             "answerTo" => 1,
            //             "keyText" => "1",
            //         ),
            //         array(
            //             "id" => 3,
            //             "title" => "Opt 2",
            //             "answerTo" => 1,
            //             "keyText" => "2",
            //         ),
            //     ),
            //     array(
            //         array(
            //             "id" => 4,
            //             "title" => "Opt 2 1",
            //             "answerTo" => 2,
            //             "keyText" => "1",
            //         ),
            //         array(
            //             "id" => 5,
            //             "title" => "Opt 2 2",
            //             "answerTo" => 2,
            //             "keyText" => "2",
            //         ),
            //         array(
            //             "id" => 6,
            //             "title" => "Opt 2 1",
            //             "answerTo" => 3,
            //             "keyText" => "1",
            //         ),
            //         array(
            //             "id" => 7,
            //             "title" => "Opt 2 2",
            //             "answerTo" => 3,
            //             "keyText" => "2",
            //         ),
            //     )                
            // );

            $dataResponse['status'] = 1;
            $dataResponse['fii'] = $clientId;

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

// 
function hasToChangeLevel($answerTo, $data) {
    $hasToChangeLevel = false;
    for($i = 0; $i<count($data) ; $i++) {
        if($data[$i]["id"] == $answerTo) {
            $hasToChangeLevel = true;
        }
    }    

    return $hasToChangeLevel;
}
