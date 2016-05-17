// essential reads:
// http://stackoverflow.com/a/13016081/1161948
// https://developers.google.com/identity/sign-in/web/backend-auth#send-the-id-token-to-your-server

var app = angular.module('ga',[]);

app.controller('gac', function($scope, $window) {
    
    var auth2;
    
    $scope.user = {};

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

    var signinChanged = function(isSignedIn) {
        console.log('signinChanged() = ', isSignedIn);
        if(isSignedIn) {
            console.log('the user must be signed in to print this');
            var googleUser = auth2.currentUser.get();
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
            console.log('the user must not be signed in if this is printing');
            $scope.user = {};
            $scope.$digest();
        }
    };

    var userChanged = function(user) {
        console.log('userChanged() = ', user);
    };
    
    $scope.signOut = function() {
        console.log('signOut()');
        gapi.auth2.getAuthInstance().signOut();
        console.log(auth2);
    };
    
    $scope.disconnect = function() {
        console.log('disconnect()');
        gapi.auth2.getAuthInstance().disconnect();
        console.log(auth2);
    };
});

