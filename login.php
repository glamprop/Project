<?php 
    $f3 = require('fatfree-master/lib/base.php');
	
	/* Development DB conn */
	$db_server = 'localhost';
	$db_port = '3306';
	$db_username = 'root';
	$db_password = '666999';
	$db_name = 'M102';
	
	/* Prodcution values */
	/*$db_server = 'sql102.byethost7.com';	
	$db_port = '3306';
	$db_username = 'b7_21018122';
	$db_password = 'm102ourtube';
	$db_name = 'b7_21018122_M102';*/
	
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
    
	//function log_user($username, $password) {
		if(isset($_POST["user_id"])) {
			
		}
		if(isset($_POST["username"]) && isset($_POST["password"])) {
			$username = $_POST["username"];
			$password = $_POST["password"];
			$conn = new mysqli($db_server, $db_username, $db_password, $db_name);
			/* check connection */
			if (mysqli_connect_errno()) {
				printf("Connection failed: %s\n", mysqli_connect_error());
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
				
				/*echo "User ID: ".$user_id."<br>";
				echo "Stored password: ".$stored_password."<br>";
				echo "Typed password : ".md5($password)."<br>";*/
				
				printf("User ID: %d\nStored password: %s\nTyped password: %s\n", $user_id, $stored_password, md5($password));
				
				$stmt->close();
                $conn->close();
                if (md5($password) == $stored_password) {
                    echo "Password OK!".'<br />';
					$db = $f3->get('DB');
					$db = new DB\SQL('mysql:host='.$db_server.';port='.$db_port.';dbname='.$db_name.';', $db_username, $db_password);
					//$f3->DB = new \DB\SQL\Session($db);					
					//$f3->DB=new DB\SQL('mysql:host=127.0.0.1;port=3306;dbname=M102;','root','666999');
					$session = new DB\SQL\Session($db);//,'sessions',NULL,'CSRF');
					$f3->CSRF = $session->csrf();
					echo $f3->CSRF.'<br />';
					echo $session->csrf().'<br />';
					$f3->copy('CSRF','SESSION.csrf');
					echo $f3->get('SESSION.csrf').'<br />';
					echo $session->sid().'<br />';
					echo $session->ip().'<br />';
					//var_dump($session);
					$f3->set('COOKIE.user', $username, 86400); // 1 day
                    return true;
                } 
                else {
                    echo "Wrong username and/or password.\r\n";
                    //return false;
                }
            }
            else {
				mysqli_close($conn);
                echo "Wrong username and/or password.\r\n";
                //return false;
            }
        }
    //}

?>
<html>
    <head>
        <meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
        <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
		<meta content="utf-8" http-equiv="encoding">
		
        <title>Login</title>
		
		<!-- STYLES -->
		<link rel="stylesheet" href="styles/bootstrap-3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="styles/login.css" />
		
		<!-- SCRIPTS -->
		<!--<script type="text/javascript" src="https://smartlock.google.com/client" async="true" defer="true"></script>-->
        <script type="text/javascript" src="scripts/jquery/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="scripts/login.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : '213828052012831',
                    cookie     : true,
                    xfbml      : true,
                    version    : 'v2.8'
                });
                FB.AppEvents.logPageView();   
                Login.checkLoginState();
            };
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);               
            }(document, 'script', 'facebook-jssdk'));
        </script>
        <div class="center-content">
			<header>
				<h1>Our<span class="red-font">Tube</span><!--<span class="rnb-black">~ YouTube Search</span></h1>-->
			</header>			
		</div>
		
		<div class="row">
			<div id="login-form" class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<h2 class="centered inherited-width">Login</h2>
				<form class="centered inherited-width login-form" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
					<div class="form-group">
						<label for="username">Username</label>
						<input type="text" class="form-control" name="username" id="username" value="<?php /*echo (isset($_POST['username'])) ? $_POST['username'] : $f3->get('COOKIE.user');*/ ?>" />
						<br />
						<label for="password">Password</label>
						<input type="password" class="form-control" name="password" id="password" />
						<br />
						<input type="submit" class="right btn btn-primary my-btn" value="App Log in" />						
						<br /><br /><br />
						<span ID="fb-button-span" class="right btn btn-primary my-btn">							
							<fb:login-button autologoutlink="false"
								scope="public_profile,email"
								login_text="Log in with FB" 
								onlogin="Login.checkLoginState();">
							</fb:login-button>
						</span>
						<span ID="fb-continue" class="right">
							... or <a href="#" id="fb-continue-text"></a>
							<img class="fb-img" src="https://www.facebook.com/rsrc.php/yl/r/H3nktOa7ZMg.ico"/>
						</span>
					</div>
				</form>
			</div> <!-- login-form -->
			<div id="signup-form" class="col-xl-12 col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<h2 class="centered inherited-width">Sign up</h2>
				<form class="centered inherited-width login-form" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
					<div class="form-group">
						<label for="signup-username">Username</label>
						<input type="text" class="form-control" name="signup-username" id="signup-username" value="<?php /*echo (isset($_POST['username'])) ? $_POST['username'] : $f3->get('COOKIE.user');*/ ?>" />
						<br />
						<label for="signup-password">Password</label>
						<input type="password" class="form-control" name="signup-password" id="signup-password" />
						<br />
						<label for="signup-confirm-password">Confirm password</label>
						<input type="password" class="form-control" name="signup-confirm-password" id="signup-confirm-password" />
						<br />
						<input type="submit" class="right btn btn-primary" value="Sign up" />
						<br />
					</div>
				</form>
			</div> <!-- signup-form -->
		</div> <!-- row -->
    </body>
</html>
