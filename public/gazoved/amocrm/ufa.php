<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/functions.php';

//file_put_contents(__DIR__.'/post.txt', print_r($_POST,true).PHP_EOL, FILE_APPEND);

$name = $post['name'];
if($name == ''){
    $name = 'Без имени';
}
$phone = $post['phone'];

$ulr = $post['page'];

$form = $post['type'];
if($form == ''){
    $form = $post['btn'];
}

$form_dop = $post['description'];



$get_contact = get_contact($subdomain, $headers, $phone);

$flag_add_lead = 0; // Нужна сделка

$id_contact = $get_contact[id];

if($id_contact != ''){ // Есть контакт
	$leads = [];
	foreach($get_contact['_embedded']['leads'] as $k=>$v){
		$leads[] = $v['id'];
	}

	if($leads != array()){
	    
	    if(count($leads) > 0){
	        
	        $leads_my = '?id[]=';
            
            if(count($leads) == 1){
                $leads_my .= $leads[0];
            }else{
                $leads_my .= implode("&id[]=", $leads);
            }

	        
	    }

	    
		
		$get_leads = get_leads($subdomain, $headers, $leads_my);
		

		//file_put_contents(__DIR__.'/post.txt', print_r($get_leads,true).PHP_EOL, FILE_APPEND);

		foreach($get_leads as $k=>$v){
			if($v['closed_at'] == ''){
				$flag_add_lead = $v['id']; // есть активная сделка, добавлять новую не нужно
				break;
			}
		}

	}else{
		//нет сделок
		$flag_add_lead = 0;
	}
}

if($id_contact == ''){ //Добавляем контакт и сделку
	$param = [];
	$param['phone_id'] = 183971;
	$param['phone'] = $phone;
	$param['responsible'] = 6545914;
	$param['name'] = $name;
	$id_contact = add_contact($subdomain, $headers, $param);
}


if($flag_add_lead == 0){ //Добавляем сделку
	$param = [];
	$param['name'] = 'Заявка с сайта от '.$name;
	$param['responsible'] = 6545914;
	$param['status'] = 36209131;
	
	$id_lead = add_lead($subdomain, $headers, $param);

	entity_leads($subdomain, $headers, $id_lead, $id_contact);

	$param = [];
	$param['id_lead'] = $id_lead;
	$param['text'] = 'Заявка с сайта'.PHP_EOL.'Имя: '.$name.PHP_EOL.'Телефон: '.$phone.PHP_EOL.'Страница: '.$ulr.PHP_EOL.'Форма: '.$form;
	
	if($form_dop != ''){
        $param['text'] .= PHP_EOL.'Дополнительно: '.$form_dop;
    }


	add_note($subdomain, $headers, $param);


	$param = [];
	$param['responsible'] = 6545914;
	$param['id_lead'] = $id_lead;
	$param['text'] = 'Обработать заявку от клиента';
	add_task($subdomain, $headers, $param);

}

if($flag_add_lead != 0){

$param = [];
$param['id_lead'] = $flag_add_lead;
$param['text'] = 'Повторная заявка с сайта'.PHP_EOL.'Имя: '.$name.PHP_EOL.'Телефон: '.$phone.PHP_EOL.'Страница: '.$ulr.PHP_EOL.'Форма: '.$form;

if($form_dop != ''){
    $param['text'] .= PHP_EOL.'Дополнительно: '.$form_dop;
}


add_note($subdomain, $headers, $param);


$param = [];
$param['responsible'] = 6545914;
$param['id_lead'] = $flag_add_lead;
$param['text'] = 'Обработать повторную заявку от клиента';
add_task($subdomain, $headers, $param);



}














?>