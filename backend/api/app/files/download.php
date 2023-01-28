<?php

    include "../connect/bd_connect.php";
    include "../helpers/utils.php";
    include "../connect/auth.php";

    $file = addslashes(trim($_GET['file']));
    $fileHashName = addslashes(trim($_GET['hash']));
    $userRole = addslashes(trim($_GET['role']));
    $authUserEmail = addslashes(trim($_GET['email']));
    $currentTimestampClean = addslashes(trim($_GET['timestamp']));
    $currentTimestampClean = str_replace(" ", "", $currentTimestampClean);
    $clientToken = 'Bearer '.addslashes(trim($_GET['token']));
    $file = str_replace(" ", "", $file);


    $JWTServerKeyCurrent = $userRole == 'ADMIN' ? $JWTServerkey : $JWTServerClientkey;

    $AuthUserData = getAuthorizatedUserData($connection, $authUserEmail, $currentTimestampClean, $JWTServerKeyCurrent, $clientToken, $userRole);
    if($AuthUserData['status'] == 1) {

        $userId = $AuthUserData['id'];


        if($userRole == 'ADMIN') {
            $queryFiles = mysqli_query($connection, "SELECT
            fil.fil_name,
            fil.fil_title,
            pay.pay_due_date,
            pay.pay_id,
            pay.pay_hash,
            cli.cli_name,
            cli.cli_service
            FROM files AS fil
            INNER JOIN payments AS pay ON pay.pay_id = fil.pay_id
            INNER JOIN clients AS cli ON cli.cli_id = pay.cli_id
            WHERE fil.fil_id = '{$file}'
            AND fil.fil_status = 1
            AND fil.fil_name = '{$fileHashName}'
            AND cli.cli_status = 1
            AND (pay.pay_status = 1 OR pay.pay_status = 2)") or die ("User Not Found");
            if (mysqli_num_rows ($queryFiles) > 0) {
                while($dataFile = mysqli_fetch_assoc($queryFiles)) {
                    $dueDate = date_format(date_create_from_format('Y-m-d', $dataFile["pay_due_date"]), 'd_m_Y');
                    $filePath = $dataFile['fil_name'];

                    $payHash = $dataFile['pay_hash'];
                    $payHash = str_replace("/", "_", $payHash);
                    $payHash = str_replace(" ", "_", $payHash);

                    $clientService = $dataFile['cli_service'];
                    $clientService = str_replace(" ", "_", $clientService);
                    $fileTitle = $dataFile['fil_title']; 
                    $fileTitle = str_replace(" ", "_", $fileTitle);

                    if( is_file( '../uploads/'.$filePath ) ){
                        $filename = '../uploads/'.$filePath;
                        
                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        $type = finfo_file($finfo, $filename);
                        header('Content-type: '.$type);
                        header('Content-Disposition: attachment; filename="'.$fileTitle.'_'.$payHash.'.pdf"');
                 
                        readfile($filename);

                    } else {
                        echo "arquivo nao encontrado";
                    }            
                }
            } else {
                echo "arquivo nao encontrado";
            }
        } else {
            $queryFiles = mysqli_query($connection, "SELECT
            fil.fil_name,
            fil.fil_title,
            pay.pay_due_date,
            pay.pay_id,
            pay.pay_hash,
            cli.cli_name,
            cli.cli_service
            FROM files AS fil
            INNER JOIN payments AS pay ON pay.pay_id = fil.pay_id
            INNER JOIN clients AS cli ON cli.cli_id = pay.cli_id
            WHERE fil.fil_id = '{$file}'
            AND fil.fil_status = 1
            AND fil.fil_name = '{$fileHashName}'
            AND cli.cli_status = 1
            AND (pay.pay_status = 2)") or die ("User Not Found");
            if (mysqli_num_rows ($queryFiles) > 0) {
                while($dataFile = mysqli_fetch_assoc($queryFiles)) {
                    $dueDate = date_format(date_create_from_format('Y-m-d', $dataFile["pay_due_date"]), 'd_m_Y');
                    $filePath = $dataFile['fil_name'];
                    $payHash = $dataFile['pay_hash'];
                    $payHash = str_replace(" ", "_", $payHash);
                    $clientService = $dataFile['cli_service'];
                    $clientService = str_replace(" ", "_", $clientService);
                    $fileTitle = $dataFile['fil_title']; 
                    $fileTitle = str_replace(" ", "_", $fileTitle);

                    if( is_file( '../uploads/'.$filePath ) ){
                        $filename = '../uploads/'.$filePath;
                        
                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        $type = finfo_file($finfo, $filename);
                        header('Content-type: '.$type);
                        header('Content-Disposition: attachment; filename="'.$fileTitle.'_'.$payHash.'.pdf"');
                 
                        readfile($filename);

                    } else {
                        echo "arquivo nao encontrado";
                    }            
                }
            } else {
                echo "arquivo nao encontrado";
            }            
        }


    } else {
        echo "nao f";
    }

 
?>