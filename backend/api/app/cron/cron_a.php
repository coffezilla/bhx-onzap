<?php 

include "../connect/bd_connect.php";
include "../helpers/utils.php";
include "../connect/auth.php";
require_once("../assets/phpmailer/PHPMailerAutoload.php");	 


$today = date("Y-m-d");

// GET REMIND TODAY
// 
// email enviado no dia, caso esteja em aberto
// 
// 

$queryPayments = mysqli_query($connection, "SELECT
pay.pay_id,
pay.pay_hash,
pay.pay_date_create,
pay.pay_due_date,
pay.pay_status,
pay.pay_ref,
pay.pay_hash,
pay.pay_price_before_due_date,
cli.cli_name,
cli.cli_cnpj,
cli.cli_cpf,
cli.cli_email,
cli.cli_service
FROM payments AS pay
INNER JOIN clients AS cli ON cli.cli_id = pay.cli_id
WHERE cli.cli_status = 1
AND cli.cli_email_auto_sender = 1
AND (pay.pay_status = 2 AND pay.pay_due_date = CURDATE())
ORDER BY pay_due_date DESC") or die ("User Not Found");

// 
while($dataPayment = mysqli_fetch_assoc($queryPayments)) {

	echo "<br>";
	echo "----------------------------------------";
	echo $dataPayment['cli_name']. ' - '.$dataPayment['cli_email'];

    $ticketsFiles = array();
    $paymentId = $dataPayment["pay_id"];
    $clientName = $dataPayment["cli_name"];
    $email = $dataPayment["cli_email"];


	$payRef = $dataPayment["pay_ref"];
	$payTitle = $dataPayment['pay_hash'];
	$payService = $dataPayment['cli_service'];
	$payValue = 'R$ '.$dataPayment['pay_price_before_due_date'];
	$payDueDate = $dataPayment['pay_due_date'];
	$payDueDate = date_format(date_create_from_format('Y-m-d', $payDueDate), 'd/m/Y');


	// ENVIO DE EMAIL
	// email
	$emailTitle = "Lembrete: Boleto em aberto";
	
	$userName = $clientName;
	$userEmail = $email;

	// sender
	$senderName = "BHX Sites";
	$senderEmail = "atendimento@bhxsites.com.br";
	
	$replyToEmail = $senderName;
	$replyToName = $senderEmail;
	// receiver
	$receiverName = $userName;
	$receiverEmail = $userEmail;


	// e-mail template
	include 'email_template_reminder.php';


	$mail = new PHPMailer();
	$mail->IsSMTP = ('smtp');
	$mail->Mailer = ('mail');
	$mail->SMTPSecure = 'ssl';
	$mail->SMTPAuth = true;
	$mail->From = $senderEmail;
	$mail->FromName = $senderName;
	$mail->AddReplyTo( $replyToEmail, $replyToName );
	$mail->AddAddress( $receiverEmail, $senderName);
	$mail->IsHTML(true);
	$mail-> CharSet = 'UTF-8';



	$mail->Subject = $emailTitle;
	$mail->Body = $emailBody;
	$mail->AltBody = $emailBody;
	$sendedEmail = $mail->Send();
	$mail->ClearAllRecipients();
	$mail->ClearAttachments();
	
	if ($sendedEmail) {  
		echo "enviado";

	} else {
		echo "Erro enviando";
	}

	$mail->clearAddresses();

	// sleep e limpa cache
	ob_flush();
	flush();

}


// ================================================================


// GET AFTER
// 
// email cobrança antecedencia
// 
// 

$queryPayments = mysqli_query($connection, "SELECT
pay.pay_id,
pay.pay_hash,
pay.pay_date_create,
pay.pay_due_date,
pay.pay_status,
pay.pay_ref,
pay.pay_hash,
pay.pay_price_before_due_date,
cli.cli_name,
cli.cli_cnpj,
cli.cli_cpf,
cli.cli_email,
cli.cli_service
FROM payments AS pay
INNER JOIN clients AS cli ON cli.cli_id = pay.cli_id
WHERE cli.cli_status = 1
AND pay.pay_send_status = 1
AND cli.cli_email_auto_sender = 1
AND (pay.pay_status = 2 AND pay.pay_due_date <= DATE_ADD(CURDATE(), INTERVAL 5 DAY) AND pay.pay_due_date >= CURDATE())
ORDER BY pay_due_date DESC") or die ("User Not Found");

// 
while($dataPayment = mysqli_fetch_assoc($queryPayments)) {

	echo "<br>";
	echo "----------------------------------------";
	echo $dataPayment['cli_name']. ' - '.$dataPayment['cli_email'];

    $ticketsFiles = array();
    $paymentId = $dataPayment["pay_id"];
    $clientName = $dataPayment["cli_name"];
    $email = $dataPayment["cli_email"];
    // $dueDate = $dataPayment["pay_due_date"];
    // $dueDate = date_format(date_create_from_format('Y-m-d', $dueDate), 'd/m/Y');


	$payRef = $dataPayment["pay_ref"];
	$payTitle = $dataPayment['pay_hash'];
	$payService = $dataPayment['cli_service'];
	$payValue = 'R$ '.$dataPayment['pay_price_before_due_date'];
	$payDueDate = $dataPayment['pay_due_date'];
	$payDueDate = date_format(date_create_from_format('Y-m-d', $payDueDate), 'd/m/Y');


    // get user data
    $queryFiles = mysqli_query($connection, "SELECT
    fil.fil_id,
    fil.fil_name,
    fil.fil_title,
    pay.pay_hash
    FROM files AS fil
    INNER JOIN payments AS pay ON pay.pay_id = fil.pay_id
    INNER JOIN clients AS cli ON cli.cli_id = pay.cli_id    
    WHERE fil.pay_id = '{$paymentId}'
    AND fil.fil_status = 1") or die ("User Not Found");
    while($dataFile = mysqli_fetch_assoc($queryFiles)) {

        $payHash = $dataFile['pay_hash'];
        $payHash = str_replace("/", "_", $payHash);
        $payHash = str_replace(" ", "_", $payHash);

        $fileTitle = $dataFile['fil_title']; 
        $fileTitle = str_replace(" ", "_", $fileTitle);
        $fileName = $fileTitle.'_'.$payHash.'.pdf';

        array_push($ticketsFiles, array(
                "id" => $dataFile["fil_id"], 
                "name" => $dataFile["fil_name"],
                "title" => $dataFile["fil_title"],
                "filename" => $fileName
            )
        );

    }                



	// ENVIO DE EMAIL
	// email
	$emailTitle = "Boleto disponível - Serviço BHX Sites";
	
	$userName = $clientName;
	$userEmail = $email;

	// sender
	$senderName = "BHX Sites";
	$senderEmail = "atendimento@bhxsites.com.br";
	
	$replyToEmail = $senderName;
	$replyToName = $senderEmail;
	// receiver
	$receiverName = $userName;
	$receiverEmail = $userEmail;


	// e-mail template
	include 'email_template_default.php';


	$mail = new PHPMailer();
	  $mail->IsSMTP = ('smtp');
	  $mail->Mailer = ('mail');
	  $mail->SMTPSecure = 'ssl';
	  $mail->SMTPAuth = true;
	$mail->From = $senderEmail;
	$mail->FromName = $senderName;
	$mail->AddReplyTo( $replyToEmail, $replyToName );
	$mail->AddAddress( $receiverEmail, $senderName);
	$mail->IsHTML(true);
	$mail-> CharSet = 'UTF-8';

    // boletos
	// attachment
    foreach ($ticketsFiles as $key => $value) {
    	echo "<br>- boleto ".$value['id'].' - '.$value['name'];
    	$mail->AddAttachment('../uploads/'.$value['name'], $value['filename'].".pdf");
    }

	

	$mail->Subject = $emailTitle;
	$mail->Body = $emailBody;
	$mail->AltBody = $emailBody;
	$sendedEmail = $mail->Send();
	$mail->ClearAllRecipients();
	$mail->ClearAttachments();
	
	if ($sendedEmail) {  
		echo "enviado";
        // update
        mysqli_query($connection, "UPDATE payments SET
        pay_send_status = 2,
        pay_send_date = '{$today}'
        WHERE pay_id = '{$paymentId}'") or die("update error");

	} else {
		echo "Erro enviando";
	}

	$mail->clearAddresses();

	// sleep e limpa cache
	ob_flush();
	flush();	

}


