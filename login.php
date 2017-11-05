<?php 

//    if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(!empty($_POST)) {
        echo "POST.<br />";
        if(isset($_POST["username"])) {
            echo "Username sent.<br />";
            if(log_user($_POST["username"], $_POST["password"])) {
                session_name("TEST_SESSION");
                session_start();
                $_SESSION['session_name'] = session_name();
                $_SESSION['user_id'] = 34;
                $_SESSION['user_name'] = "Sotos";
                $_SESSION['user_type'] = "Admin";
                echo session_name() . "<br />";
                echo session_id() . "<br />";

                if(isset($_GET["returnUrl"])) {
                    header("Location: " . $_GET["returnUrl"]);
                }
            }
        }        
    }
    
    if(isset($_GET['logout'])) {
        session_start();
        session_unset();
        session_destroy();
        session_write_close();
        setcookie(session_name(), '', 0);

        echo "Logged out";
        exit;
    }
    
    function log_user($username, $password) {
        if(isset($_POST["username"]) && isset($_POST["password"])) {
            $link = mysqli_connect('localhost','root','666999') or die('Cannot connect to the DB');
            mysqli_select_db($link,'M102') or die('Cannot select the DB');
            $query = "SELECT user_id, user_password FROM user_login_info WHERE user_login = '$username'";
            $result = mysqli_query($link,$query) or die('Errant query:  '.$query);
            if(mysqli_num_rows($result)) {
                $user_id = mysqli_fetch_assoc($result)['user_id'];
                $stored_password = mysqli_fetch_assoc($result)['user_password'];
                @mysqli_close($link);
                if (md5($password) == $stored_password) {
                    echo "Password OK!";
                    return true;
                } 
                else {
                    echo "Wrong username and/or password.\r\n";
                    return false;
                }
            }
            else {
                echo "Wrong username and/or password.\r\n";
                return false;
            }
        }
    }
?>
<html>
    <head>
        <title>Login</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="Project/styles/login.css" />
        <script type="text/javascript" src="Project/scripts/jquery/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="Project/scripts/login.js"></script>
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
                checkLoginState();
            };
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);               
            }(document, 'script', 'facebook-jssdk'));
        </script>
        <div class="login centered">
            <h1>Youtube API Search</h1>
            <h2>Login</h2>
            <h2>(M102)</h2>
            <div id="login-form">
                <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                    <label class="left" for="username">Username</label>
                    <input class="right" type="text" id="username" />
                    <br /><br />
                    <label class="left" for="password">Password</label>
                    <input class="right" type="password" id="password" />
                    <br /><br />
<!--                    <button class="left login-btn" onclick="login();">App Login</button>-->
                    <input type="submit" class="left login-btn" value="App Login" />
                    <!--<button class="login-btn" onclick="$('#fb-login-conainer').show();">FB Login</button>-->
                    <!--<button id="login-btn" onclick="checkLoginState();">Login</button>-->
                    <!--<div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="true" data-auto-logout-link="true" data-use-continue-as="true"></div>-->
                    <span ID="fb-button-span" class="right">
                        <fb:login-button autologoutlink="true"
                            scope="public_profile,email"
                            onlogin="checkLoginState();">
                        </fb:login-button>
                    </span>
                </form>
            </div>
        </div>
        <div id="fb-login-conainer" class="invisible centered">
            <div id="status"></div>
<!--            <div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="true" data-auto-logout-link="true" data-use-continue-as="true"></div>-->
        </div>
    </body>
</html>
