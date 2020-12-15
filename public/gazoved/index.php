<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

//<add name="Access-Control-Allow-Headers" value="Content-Type" />

$post = json_decode(file_get_contents("php://input") , true);
file_put_contents(__DIR__.'/test.txt', print_r($post,true), FILE_APPEND);

if($post['domen'] != '' and $post['domen'] == 'ufa.gazoved.com'){//Уфа
    require_once __DIR__ . '/amocrm/ufa.php';
}
?>