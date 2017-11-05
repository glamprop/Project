<?php
    session_name("TEST_SESSION");
    session_start();
    
    if(!isset($_SESSION['session_name'])) {
        header("Location: login.php?returnUrl=index.php");
        exit;
    }
    else {
        echo count($_SESSION) . "<br />";
        echo $_SESSION['session_name'] . "<br />";
        echo $_SESSION['user_id'] = 34 . "<br />";
        echo $_SESSION['user_name'] = "Sotos" . "<br />";
        echo $_SESSION['user_type'] = "Admin" . "<br />";
        //echo session_name() . "<br />";
        echo "Active session detected!<br />";
        echo session_id() . "<br />";
        echo '<a href="login.php?logout">Log out</a>';        
    }
    


