var Login = (function() {
    var name, email;
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
            $('#fb-button-span').hide();
            $('#fb-continue').show();
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
			console.log(response);
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
            username: $("#username").val(), 
            password: $("#password").val()
        };
        //console.log(postData);

        $.ajax({
            type: "POST",
            url: "login.php",
            data: postData,
            success: function(e) { console.log(e); },
            error: function(e) { alert(e); }
        });

    };
	
	var getFBInfo = function () {
		FB.api('/me', { locale: 'en_US', fields: 'name, email' },
			function(response) {
				name = response.name;
				email = response.email;
                $('#fb-continue-text').text('Continue as ' + name);
			}
        );
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
        getFBName  			: getFBName,
		getFBEmail			: getFBEmail
	};
})()	