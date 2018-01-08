var Login = (function() { 
	$(document).ready(function() {
		$('#login-form').on('submit', function(e) {
			e.preventDefault();
			if (!Login.checkLoginInput()) {
				alert("Check Input!");
			}
			else {
				appLogin();
			}
		});
		$('#signup-form').on('submit', function(e) {
			e.preventDefault();
			if (!Login.checkSignupInput()) {
				alert("Check Input!");
			}
			else {
				appSignup();
			}
		});
	});   
	var name, email;
	var searchURL = 'http://localhost:8080/M102/Project/searchPage.html';
	//var searchURL = 'http://ourtube.byethost7.com/searchPage.html';
	
    // This is called with the results from from FB.getLoginStatus().
    var statusChangeCallback = function (response) {
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            //document.getElementById('status').innerHTML = '';
            getFBInfo();
			console.log('Connected via Facebook Login API.');
            $('#login-frame').attr('src', '');
            $('#login-div').hide();            
        } 
        else {
            // The person is not logged into your app or we are unable to tell.
            //document.getElementById('status').innerHTML = 'Please log into this app.';
            console.log('Not connected on Facebook.');
//            if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1) !== 'login.html') {
//                window.location.href = 'login.html';
//            }
//            else {
                $('#login-div').show();
                $('#login-frame').attr('src', 'login.html');
//            }
//            $("#fb-button-span").html(
//                '<fb:login-button ' +
//                ' autologoutlink="true" ' +
//                'scope="public_profile,email" ' +
//                'onlogin="checkLoginState();">' +
//                '</fb:login-button>'
//            );
        }
    };

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    var checkLoginState = function () {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    };

    var checkSession = function (sessionKey) {
        var postData = {
            session_key: sessionKey
        };
        console.log(postData);

        $.ajax({
            type: "POST",
            url: "login.php",
            data: postData,
            success: function(e) { console.log(e); },
            error: function(e) { console.log(e); }
        });
    };

    var appLogin = function () {
        var postData = {
            "username": $("#username").val(), 
            "password": $("#password").val()
        };
        //console.log(postData);

        $.ajax({
            type: "POST",
            url: "login.php",
            data: postData,
            success: function(e) { 
				console.log(e); 
				if (e.toLowerCase() === 'success') {
					window.location.href = searchURL;
				}
				else {
					$('#login-error-span').show().html(e);
				}
			},
            error: function(e) {
				$('#login-error-span').show().html(e);
			}
        });
    };
    
	var appSignup = function () {
        var postData = {
			"signup-email": $("#signup-email").val(),
            "signup-username": $("#signup-username").val(), 
            "signup-password": $("#signup-password").val(),
			"signup-confirm-password": $("#signup-confirm-password").val()
        };
        //console.log(postData);

        $.ajax({
            type: "POST",
            url: "login.php",
            data: postData,
            success: function(e) { 
				console.log(e); 
				if (e.toLowerCase() === 'success') {
					window.location.href = searchPage;
				}
				else {
					$('#signup-error-span').show().html(e);
				}
			},
            error: function(e) { 
				$('#signup-error-span').show().html(e);
			}
        });
    };
	
	var getFBInfo = function () {
		FB.api('/me', { locale: 'en_US', fields: 'name, email' },
			function(response) {
				name = response.name;
				email = response.email;
				$('#fb-button-span').hide();
				$('#fb-continue').show();
                $('#fb-continue-text').text('Continue as ' + name);
			}
        );
	};
	
	var checkLoginInput = function () {
		if ($('#username').val().trim() === '') {
			$('#username').addClass('error');
			return false;
		}
		else {
			$('#username').removeClass('error');
		}
		if ($('#password').val().trim() === '') {
			$('#password').addClass('error');
			return false;
		}
		else {
			$('#password').removeClass('error');
		}
		return true;
	};
	
	var checkSignupInput = function () {
		if ($('#signup-username').val().trim() === '') {
			$('#signup-username').addClass('error');
			return false;
		}
		else {
			$('#signup-username').removeClass('error');
		}
		if ($('#signup-password').val().trim() === '') {
			$('#signup-password').addClass('error');
			return false;
		}
		else {
			$('#signup-password').removeClass('error');
		}
		if ($('#signup-confirm-password').val().trim() === '') {
			$('#signup-confirm-password').addClass('error');
			return false;
		}
		else {
			$('#signup-confirm-password').removeClass('error');
		}
		if ($('#signup-password').val() !== $('#signup-confirm-password').val()) {
			$('#signup-password').addClass('error');
			$('#signup-confirm-password').addClass('error');
			return false;
		}
		return true;
	};
	
    var getFBName = function () {
        return name;        
    };
    
    var getFBEmail = function () {
        return email;        
    };
    
	//Return public functions
	return {
		appLogin			: appLogin,
		checkLoginState		: checkLoginState,
		checkSignupInput	: checkSignupInput,
		checkLoginInput		: checkLoginInput,
        getFBName  			: getFBName,
		getFBEmail			: getFBEmail
	};
})();