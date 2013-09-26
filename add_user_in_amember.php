<?php
/******************
**
**  This page adds a user from a landing page on the way to the prize.
**
******************/
	foreach($_POST as $key=>$var) {
		$_POST[$key] = strip_tags(htmlentities($var));
	}
	$name = explode(' ',$_POST['name']);
	$first_name = $name[0];
	$last_name = ((isset($name[1]))&&(!empty($name[1])))?$name[1]:'';
	$email = $_POST['email_address'];
	$url = 'amember/api/users';
 	if ($email=='') {
		exit();
	}
	$fields = array(
				'_key' => 'xxxxxxxxxxxxxxxxx',
				'_format' => 'xml',
				'login' => strtolower($first_name.'_'.$last_name),
				'pass' => '0000',
				'email' => $email,
				'name_f' => $first_name,
				'name_l' => $last_name,
		);
	 
	 
	$fields_string  = http_build_query($fields);
	//open connection
	$ch = curl_init();
	 
	//set the url, number of POST vars, POST data
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_POST,count($fields));
	curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	//execute post
	$result = curl_exec($ch);
	 
	//close connection
	curl_close($ch);
	/*******************
	**
	**	Set up auto-responders
	**
	*******************/
	$subject = "Welcome to Astrology Master Academy";
	$to = $email;
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	$headers .= 'From:'."";
	$body = "<p>Thank you for your interest in.</p>";
	$body .= "<p>This is the year I plan to get my message out in a much bigger way.  I am going to be sending out a lot of informational videos as well as keeping the members informed as to </p>";
	$body .= "<p>We'll be sending you links to new videos and keep you abreast of current events.</p>";
	$body .= "<p>Thank you again for your interest and support.</p>";
	$body .= "<p>Sincerely,</p>";
	$body .= "<p></p>";
	mail($to, $subject, $body, $headers);
	
	$body = $_POST['name'].' ('.$_POST['email_address'].') just joined.';
	$to = '';
	$subject = 'New signup on Astrology Master Academy';
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	$headers .= 'From:'."website@";
	mail($to, $subject, $body, $headers);

?>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-xxxxxxx-6']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
<meta http-equiv="refresh" content="0;URL='http://website.com/thanks.php'">