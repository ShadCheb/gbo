<?php

//домен амо
$subdomain = 'gazovedufa';
//id интеграции
$client_id = '8b41be76-8e93-4b16-8e22-ffd3066eb69a';
//Секрет интеграции
$client_secret = 'HtPnCM5neyrBYzLkiiCZvu8zO5JRLrjryQthvTIoGDPgdfLQyGvjdFZgSS2L1qf4';
//код интеграции
$code = 'def50200c8871dfdf11f03ba0d4c815197dfee2cfd44a5c0765dbb15a474fb8cfd2e4cb4b2ac903ece1d14454f5b8744e83d804507b5a47bc0be7743fd60222d8013649be4d4b3c9fe09bae4ebcd892a8ef3cb423da3652599f0e5f545e4fef0716f92881da0fa83c771a22d5ceac4954712c395077b8ab81296fb084c1c021c985fa0eff47f504d833b9b204e5f4bc59872e1edfa19acec2755401e34bf9c125f4d14d23696d5e6b05114e5133d77d2c9088a9558f85820fb08895bc65b4bd8fd4603b50fc5ab5905462abecbcbd9d0b37be64c7d02afe9d77e4b82379bb2642541002f406d88f23042d200d9db73d0867b5d08c367bb5cdabfa124cfea7c5c29a43ea0565f9ea63f91984145c0bceb432068cbb372a59a932600c86d869536ccbdcdfc0d7c9c6a40746b7f525b9c577cfd47659021fa1444d79b92ceff7385c2a59e9aca3325a65c77bd91e2bc57cbfd5816da3f17958866533c11a7fcbb6abfc596f11d1531922b4a654c9f07998c043954df489e52afb9bf3572b9af5944e0dd898ada3f9e4884bad748685fd63b3e576462c6649fa0b28f2a61f10bf8ffc2e4d2f2324375d2043154e79049057141427028308463d0f056065b003932';

function auth_new($subdomain, $client_id, $client_secret, $code)
{

    $json_auth = json_decode(file_get_contents(__DIR__ . '/json_auth.json') , true);

    //Нет авторизации
    if ($json_auth['expires_in'] == '')
    {

        function access_token($subdomain, $client_id, $client_secret, $code)
        {
            $link = 'https://' . $subdomain . '.amocrm.ru/oauth2/access_token';

            $data = ['client_id' => $client_id, 'client_secret' => $client_secret, 'grant_type' => 'authorization_code', 'code' => $code, 'redirect_uri' => 'https://gazoved.com/', ];
            
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
            curl_setopt($curl, CURLOPT_URL, $link);
            curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $json_auth = curl_exec($curl);
            $json_auth = json_decode($json_auth, true);
            

            
            var_dump($json_auth);

            curl_close($curl);
            
            if($json_auth["access_token"] == ''){
                exit;
            }

            
            //Пишем тип токена (token_type), время его жизни (expires_in), сам токен (access_token), и токен обновления токена по истечении времени жизни  (refresh_token)
            file_put_contents(__DIR__ . '/json_auth.json', json_encode($json_auth, JSON_PRETTY_PRINT));
            
            return $json_auth["access_token"];
            
        }

        $access_token = access_token($subdomain, $client_id, $client_secret, $code);
        
        return $access_token;

    }
    else
    {
        //проверяем срок access_token
        if ((filemtime(__DIR__ . '/json_auth.json') + $json_auth['expires_in']) - time() <= 200)
        {
            
            //Обновление токена если истекло его время жизни
            function access_token_new($subdomain, $client_id, $client_secret, $refresh_token)
            {
                $link = 'https://' . $subdomain . '.amocrm.ru/oauth2/access_token';

                $data = ['client_id' => $client_id, 'client_secret' => $client_secret, 'grant_type' => 'refresh_token', 'refresh_token' => $refresh_token, 'redirect_uri' => 'https://gazoved.com/', ];

                $curl = curl_init();
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-oAuth-client/1.0');
                curl_setopt($curl, CURLOPT_URL, $link);
                curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
                curl_setopt($curl, CURLOPT_HEADER, false);
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                $json_auth = curl_exec($curl);

                $json_auth = json_decode($json_auth, true);

                curl_close($curl);
                
                //Пишем тип токена (token_type), время его жизни (expires_in), сам токен (access_token), и токен обновления токена по истечении времени жизни  (refresh_token)
                file_put_contents(__DIR__ . '/json_auth.json', json_encode($json_auth, JSON_PRETTY_PRINT));
                
                function test_oath($subdomain, $auth, $client_id){
                    
                    $headers = ['Authorization: Bearer ' . $auth];
                    
                    $link = 'https://' . $subdomain . '.amocrm.ru/api/v2/account';
                    $curl = curl_init();
                    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
                    curl_setopt($curl,CURLOPT_URL, $link);
                    curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
                    curl_setopt($curl,CURLOPT_HEADER, false);
                    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
                    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
                    $out = curl_exec($curl);
                    $out = json_decode($out,true);
                    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                    curl_close($curl);
                    
                }
                
                test_oath($subdomain, $json_auth["access_token"], $client_id);
                
                return $json_auth["access_token"];
            }

            $refresh_token = $json_auth['refresh_token'];
            $access_token_new = access_token_new($subdomain, $client_id, $client_secret, $refresh_token);
            
            return $access_token_new;

        }else{
            return $json_auth['access_token'];
        }

    }
}

$auth = auth_new($subdomain, $client_id, $client_secret, $code);
$headers = ['Authorization: Bearer ' . $auth];




