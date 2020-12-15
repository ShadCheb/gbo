<?php


function get_leads($subdomain, $headers, $query)
{    
    file_put_contents(__DIR__.'/post.txt', 'Ищем сделку'.PHP_EOL, FILE_APPEND);
    
    $link = 'https://' . $subdomain . '.amocrm.ru/api/v4/leads' . $query;
    
    file_put_contents(__DIR__.'/post.txt', $link.PHP_EOL, FILE_APPEND);
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl);
    curl_close($curl);
    $out = json_decode($out, true);
    
    file_put_contents(__DIR__.'/post.txt', 'Ответ'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($out,true).PHP_EOL, FILE_APPEND);

    return $out['_embedded']['leads'];
}

function get_contact($subdomain, $headers, $query)
{
    
    
    
    $query = substr($query, -10);
    
    file_put_contents(__DIR__.'/post.txt', 'Ищем контакт'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($query,true).PHP_EOL, FILE_APPEND);
    
    $link = 'https://' . $subdomain . '.amocrm.ru/api/v4/contacts?with=leads&query=' . $query;
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl);
    curl_close($curl);
    $out = json_decode($out, true);

    foreach( $out["_embedded"]["contacts"] as $k=>$v){
        
        foreach($v['custom_fields_values'] as $k1=>$v1){
            
            if($v1['field_code'] == 'PHONE'){
                
                $pos = strpos($v1['values']['0']['value'], $query);
                if($pos == true){
                    
                    file_put_contents(__DIR__.'/post.txt', 'Ответ'.PHP_EOL, FILE_APPEND);
                    file_put_contents(__DIR__.'/post.txt', print_r($v,true).PHP_EOL, FILE_APPEND);

                    return $v;

                    break 2;
                }
                
                
            }
            
        }
        
        
        
        
    }
    
    file_put_contents(__DIR__.'/post.txt', 'Ответ пуст'.PHP_EOL, FILE_APPEND);

    

    

}


function add_contact($subdomain, $headers, $param)
{


    
    $link = 'https://' . $subdomain . '.amocrm.ru/api/v4/contacts'; //Формируем URL для запроса
    $data = array(
        0 => array(
            "custom_fields_values" =>   [
                                            [
                                                'field_id' => $param['phone_id'],
                                                'values' => [
                                                                [
                                                                'value' => $param['phone'],
                                                                'enum_code' => 'WORK'
                                                                ]
                                                            ]
                                            ]
                                        ],
            'name' => $param['name'],
            'responsible_user_id' => (int)$param['responsible'],
            '_embedded' => [

                'tags' => [
                    ['name' => 'сайт']
                ]
            ]
        ) ,
    );
    
    file_put_contents(__DIR__.'/post.txt', 'Добавляем контакт'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($data,true).PHP_EOL, FILE_APPEND);


    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl);
    curl_close($curl);
    $out = json_decode($out, true);

    file_put_contents(__DIR__.'/post.txt', 'Ответ'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', $out["_embedded"]["contacts"][0]["id"].PHP_EOL, FILE_APPEND);
    
    return $out["_embedded"]["contacts"][0]["id"];
}

function add_lead($subdomain, $headers, $param)
{

    
    $link = 'https://' . $subdomain . '.amocrm.ru/api/v4/leads'; //Формируем URL для запроса
    $data = array(
        0 => array(
            'name' => $param['name'],
            'responsible_user_id' => (int)$param['responsible'],
            'status_id' => (int)$param['status'],
            '_embedded' => [

                'tags' => [
                    ['name' => 'сайт']
                ]
            ]
        ) ,
    );
    
    file_put_contents(__DIR__.'/post.txt', 'Добавляем  сделку'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($data,true).PHP_EOL, FILE_APPEND);

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl);
    curl_close($curl);
    $out = json_decode($out, true);
    
    file_put_contents(__DIR__.'/post.txt', 'Ответ'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', $out["_embedded"]["leads"][0]["id"].PHP_EOL, FILE_APPEND);
    
    return $out["_embedded"]["leads"][0]["id"];

}

function entity_leads($subdomain, $headers, $id_lead, $id_contact)
{

        
    $link = 'https://' . $subdomain . '.amocrm.ru/api/v4/leads/'.$id_lead.'/link';
    $data = array(
        0 => array(
            'to_entity_id' => $id_contact,
            'to_entity_type' => 'contacts',
            'metadata' => [
                'is_main' => true,
            ]

        )
    );
    
    
    file_put_contents(__DIR__.'/post.txt', 'Объединение сделки и контакта'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', $link.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($data,true).PHP_EOL, FILE_APPEND);
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl);
    
    file_put_contents(__DIR__.'/post.txt', 'Ответ'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($out,true).PHP_EOL, FILE_APPEND);
    
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

}

function add_note($subdomain, $headers, $param)
{	

	$link = 'https://' . $subdomain . '.amocrm.ru/api/v4/leads/notes';
    $data = array(
        0 => array(
            'entity_id' => (int)$param['id_lead'],
            'note_type' => 'common',
            'params' => ['text' => $param['text']]

        ) ,
    );
    
    
    file_put_contents(__DIR__.'/post.txt', 'Добавление примечания'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($data,true).PHP_EOL, FILE_APPEND);

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl);
    
    file_put_contents(__DIR__.'/post.txt', 'Ответ'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($out,true).PHP_EOL, FILE_APPEND);
    
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);


}



function add_task($subdomain, $headers, $param)
{   
    
    $link = 'https://' . $subdomain . '.amocrm.ru/api/v4/tasks';
    $data = array(
        0 => array(
            'responsible_user_id' => (int)$param['responsible'],
            'created_by' => (int)$param['responsible'],
            'entity_id' => (int)$param['id_lead'],
            'entity_type' => 'leads',
            'text' => $param['text'],
            'complete_till' => (time() + 900)

        )
    );
    
    file_put_contents(__DIR__.'/post.txt', 'Добавление задачия'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($data,true).PHP_EOL, FILE_APPEND);
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
    curl_setopt($curl, CURLOPT_URL, $link);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl);
    
    file_put_contents(__DIR__.'/post.txt', 'Ответ'.PHP_EOL, FILE_APPEND);
    file_put_contents(__DIR__.'/post.txt', print_r($out,true).PHP_EOL, FILE_APPEND);
    
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

}

?>