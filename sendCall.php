<?php
    // Include the Twilio PHP library
	require('twilio-php/Services/Twilio.php');
 
    // Twilio REST API version
    $version = "2010-04-01";
 
    // Set our Account SID and AuthToken
  $sid = "AC76de558201b9927e3bdb03f209f15a81"; 
  $token = "4ba4e3995a2e1fd5de33d8af2676a84f"; 

    // A phone number you have previously validated with Twilio
    $phonenumber = '6465028711';
     
    // Instantiate a new Twilio Rest Client
    $client = new Services_Twilio($sid, $token, $version);
 // 	$response = new Services_Twilio_Twiml;
	// $response->say("Hello Tushar, how are you doing today?");

    try {
        // Initiate a new outbound call
        $call = $client->account->calls->create(
            $phonenumber, // The number of the phone initiating the call
            '+16072167043', // The number of the phone receiving call
            'http://demo.twilio.com/welcome/voice/'
        );
        echo 'Started call: ' . $call->sid;
    } catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
    }
?>
