<?php
	$f3 = require('M102/fatfree-master/lib/base.php');
	//$db = require('M102/fatfree-master/lib/db/sql.php');
	$db = new \DB\SQL('mysql:host=localhost;port=3306;dbname=M102','root','666999');
	echo $db->driver().'<br />'; // mysql
	/*new Session();
	$f3->set('SESSION.test',123);
	echo $f3->get('SESSION.test');*/
	new Session(NULL,'CSRF');
	echo $f3->CSRF.'<br />'; // token here
    //$f3 = require('M102/fatfree-master/lib/base.php');
    //$f3 = require('M102/fatfree-master/lib/web/oauth2.php');

	class WebPage {
		function display() {
			echo 'About!';
		}
	}
	$f3->route('GET /',
        function() {
            echo 'Hello, Index!';
        }
    );
	$f3->route('GET /about', 'WebPage->display');
	$f3->route('GET /login', 'Controller\Auth::login');
	$f3->route('GET /brew/@count',
		function($f3) {
			echo $f3->get('PARAMS.count').' bottles of beer on the wall.';
		}
	);
	/*//same as that:
	$f3->route('GET /brew/@count',
		function($f3,$params) {
			echo $params['count'].' bottles of beer on the wall.';
		}
	);*/
    $f3->run();
    