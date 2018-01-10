<?php 
    $f3 = require('fatfree-master/lib/base.php');
	
	/* Development DB conn */
	/*$db_server = 'localhost';
	$db_port = '3306';
	$db_username = 'root';
	$db_password = '666999';
	$db_name = 'M102';*/
		
	
	/* Prodcution values */
	/*$db_server = 'sql102.byethost7.com';	
	$db_port = '3306';
	$db_username = 'b7_21018122';
	$db_password = 'm102ourtube';
	$db_name = 'b7_21018122_M102';*/
	
	/* Prodcution values */
	$db_server = 'sotos.re.mysql';	
	$db_port = '3306';
	$db_username = 'sotos_re';
	$db_password = 'RvvkaLWP8thSjTPRzL5E2ri2';
	$db_name = 'sotos_re';
	
	
	//echo $_POST[0].','.$_POST[1].','.$_POST[2].','.$_POST[3];
	//exit();
	
    if(isset($_GET['logout'])) {
        session_start();
        session_unset();
        session_destroy();
        session_write_close();
        setcookie(session_name(), '', 0);
		$f3 = require('fatfree-master/lib/base.php');
		echo $f3->CSRF."<br />";
		$f3->CSRF = "";
		echo $f3->CSRF."<br />";
        echo "Logged out";
        exit();
    }
    	
	elseif(isset($_POST["signup-username"]) && isset($_POST["signup-password"]) 
			&& isset($_POST["signup-email"]) && isset($_POST["signup-confirm-password"])) {
		$username = $_POST["signup-username"];
		$email = $_POST["signup-email"];
		$password = $_POST["signup-password"];
		$confirm_password = $_POST["signup-confirm-password"];
		if ($password != $confirm_password) {
			echo "Passwords do not match!";
			exit();
		}
		//printf("%s\n%s\n%s\n", $username, $password, $confirm_password);
		$conn = new mysqli($db_server, $db_username, $db_password, $db_name);
		if (mysqli_connect_errno()) {
			printf("Connection failed: %s\n", mysqli_connect_error());
			exit();
		}
		
		//email check
		$query = "SELECT 1 FROM user_base WHERE user_email = ?";
		$stmt = $conn->prepare($query);
		/* bind parameters for markers */
		$stmt->bind_param('s', $email);
		/* execute query */
		$stmt->execute();
		$result = $stmt->get_result();
		/* if results have rows... */
		if ($result->num_rows > 0) {
			echo 'Sorry, this e-mail is already in use.';
			exit();
		}
		
		//username check
		$query = "SELECT 1 FROM user_login_info WHERE user_login = ?";
		$stmt = $conn->prepare($query);
		/* bind parameters for markers */
		$stmt->bind_param('s', $username);
		/* execute query */
		$stmt->execute();
		$result = $stmt->get_result();
		/* if results have rows... */
		if ($result->num_rows > 0) {
			echo 'Sorry, this username is already in use.';
			exit();
		}
					
		$query = "INSERT INTO user_base (user_email) VALUES (?)";
		$stmt = $conn->prepare($query);
		
		/* bind parameters for markers */
		$stmt->bind_param('s', $email);
		/* execute query */
		$stmt->execute();
		$query = "SELECT LAST_INSERT_ID()";
		$result = $conn->query($query);
		$user_id = 0;
		if ($result->num_rows > 0) {
			// output data of each row
			while($row = $result->fetch_array()) {
				echo "id: " . $row[0]."<br>";
				$user_id = $row[0];
			}
		}
		/* if results have rows... */
		if ($user_id > 0) {
			$query = "INSERT into user_login_info (user_id, user_login, user_password) values (?, ?, md5(?))";
			$stmt = $conn->prepare($query);
			/* bind parameters for markers */
			$stmt->bind_param('sss', $user_id, $username, $password);
			$stmt->execute();
			echo "User added successfully!";
			exit();
		}
		else {
			echo "User could not be added!";
			exit();
		}
	}
	elseif(isset($_POST["username"]) && isset($_POST["password"])) {
		$username = $_POST["username"];
		$password = $_POST["password"];
		$conn = new mysqli($db_server, $db_username, $db_password, $db_name);
		/* check connection */
		if (mysqli_connect_errno()) {
			echo "Connection failed: %s\n". mysqli_connect_error();
			exit();
		}
		
		//mysqli_select_db($conn) or die('Cannot select the DB');
		$query = "SELECT user_id, user_password FROM user_login_info WHERE user_login = ?";
		$stmt = $conn->prepare($query);
		/* bind parameters for markers */
		$stmt->bind_param('s', $username);
		/* execute query */
		$stmt->execute();
		/* get results */
		$result = $stmt->get_result();
		/* if results have rows... */
		if ($result->num_rows > 0) {
			$rows = $result->fetch_assoc();
			$stored_password = $rows['user_password'];
			$user_id = $rows['user_id'];
			
			//printf("User ID: %d\nStored password: %s\nTyped password: %s\n", $user_id, $stored_password, md5($password));
			
			$stmt->close();
			$conn->close();
			if (md5($password) == $stored_password) {
				//echo "Password OK!".'<br />';
				$db = $f3->get('DB');
				$db = new DB\SQL('mysql:host='.$db_server.';port='.$db_port.';dbname='.$db_name.';', $db_username, $db_password);
				//$f3->DB = new \DB\SQL\Session($db);					
				//$f3->DB=new DB\SQL('mysql:host=127.0.0.1;port=3306;dbname=M102;','root','666999');
				$session = new DB\SQL\Session($db);//,'sessions',NULL,'CSRF');
				$f3->CSRF = $session->csrf();
				//echo $f3->CSRF.'<br />';
				//echo $session->csrf().'<br />';
				$f3->copy('CSRF','SESSION.csrf');
				//echo $f3->get('SESSION.csrf').'<br />';
				//echo $session->sid().'<br />';
				//echo $session->ip().'<br />';
				//var_dump($session);
				$f3->set('COOKIE.user', $username, 86400); // 1 day
				echo "Success";
				exit();
			} 
			else {
				echo "Wrong username and/or password.\r\n";
				exit();
			}
		}
		else {
			mysqli_close($conn);
			echo "Wrong username and/or password.\r\n";
			exit();
		}
	}
	else {
		echo "AYTAAAA...";
		exit();
	}
?>