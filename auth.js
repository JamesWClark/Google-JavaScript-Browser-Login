// essential reads:
// http://stackoverflow.com/a/13016081/1161948
// https://developers.google.com/identity/sign-in/web/backend-auth#send-the-id-token-to-your-server

var app = angular.module('ga',[]);

app.controller('gac', function($scope, $window) {
    
    $scope.user = {};
    
    var auth2;

    $window.appStart = function() {
        console.log('appStart()');
        gapi.load('auth2', initSigninV2);
    };


    var initSigninV2 = function() {
        console.log('initSigninV2()');
        auth2 = gapi.auth2.getAuthInstance();
        auth2.isSignedIn.listen(signinChanged);
        auth2.currentUser.listen(userChanged);
    };

    var signinChanged = function(val) {
        console.log('signinChanged() = ', val);
    };

    // this seems to fire right before the signout happens, as if to provide a reference to the user object on their way out of the application
    var userChanged = function(googleUser) {
        console.log('userChanged() = ', googleUser);
        // if the page is refreshed and user is signed out, the script still generates a user with null fields
        if(googleUser.El != null && googleUser.hg != null) {
            var profile = googleUser.getBasicProfile();
            $scope.user.idToken   = googleUser.getAuthResponse().id_token;
            $scope.user.fullName  = profile.getName();
            $scope.user.firstName = profile.getGivenName();
            $scope.user.lastName  = profile.getFamilyName();
            $scope.user.photo     = profile.getImageUrl();
            $scope.user.email     = profile.getEmail();
            $scope.user.domain    = googleUser.getHostedDomain();
            $scope.user.timestamp = moment().format();
            $scope.user.ip        = VIH_HostIP;
            $scope.$digest();
        } else {
            $scope.user = {};
            $scope.$digest();
        }
    };

    $scope.signOut = function() {
        console.log('signOut()');
        auth2 = gapi.auth2.getAuthInstance().signOut();
    };
    
    $scope.disconnect = function() {
        console.log('disconnect()');
        auth2 = gapi.auth2.getAuthInstance().disconnect();
    };
});

