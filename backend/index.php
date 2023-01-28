<?php

// echo "por";

$foo = array(

        array(
            "id" => 2,
            "title" => "Opt 1",
            "answerTo" => 1,
            "keyText" => "1",
        ),
        array(
            "id" => 3,
            "title" => "Opt 2",
            "answerTo" => 1,
            "keyText" => "2",
        ),

);

// echo $foo[0]["id"];


// check if answerTo is in this row
$answerTo = 1;
$hasToChangeLevel = false;
for($i = 0; $i<count($foo) ; $i++) {
	if($foo[$i]["id"] == $answerTo) {
		$hasToChangeLevel = true;
	}
}

if($hasToChangeLevel) {
	echo "Tem que mudar";
} else {
	echo "NAO muda";
}
// foreach ($answerTo as $key => $value) {
// 	// code...
// }

// $boo = array(1,2,3);

// $item = array(
//         "id" => 1,
//     );

// if(in_array($item, $foo)) {
// 	echo "tem";
// }  else {
// 	echo "nao tem";
// }