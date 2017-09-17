app.controller('signupCtrl', function ($scope, $http,$rootScope,toastr,$location,$window) {


    //0:variable decalration
    var baseURL = "http://18.220.55.145/meri_kitaab/index.php/";
    $scope.loginData = {};//info of school data
    $rootScope.isLoggedIn=0;
    //end of 0

    //1:command set ajax calling function
    var commonSetHTTPService = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                toastr.success(response.data.message, 'Success');
                callback(1);
            }
            if (response.data.status == false) {
                console.log(',,,');
                toastr.error(response.data.message, 'Error');
            }
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 

    //1:command get ajax calling function
    var commonGetHTTPService = function (method, data, url, callback) {
        $http({
            method: method,
            url: baseURL + url,
            dataType: 'JSON',
            data: data,
            headers: {
                "Content-type": "application/json"
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.status == true) {
                callback(response.data.data);
            }
            if (response.data.status == false) {
                toastr.error(response.data.message, 'Error');
            }
            $('#loader').hide();
        }, function (error) {
            $('#loader').hide();
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 


    $scope.validateData = function (data, callback) {
        callback(1);
    }

    $scope.signup = function () {
        console.log('signup function called');
        if ($scope.customer.customer_password != $scope.customer.customer_confirm_password) {
            toastr.error(" Password Doesn't Match ", 'Error');
        }
        else {
            $('#loader').show();
            $scope.validateData($scope.customer, function (result) {
                if (result === 1) {
                    commonSetHTTPService('Post', $scope.customer, 'customer/signup', function (result) {
                        if (result) {
                            $location.path('/');
                        }
                    });
                }
            });
        }
    }

      $scope.login = function () {
        console.log('login function called');
        console.log($scope.customer);
            $('#loader').show();
            $scope.validateData($scope.customer, function (result) {
                if (result === 1) {
                    commonSetHTTPService('Post', $scope.customer, 'customer/login', function (result) {
                        if (result) {
                            // $location.path('/');
                            $window.location.reload();
                        }
                    });
                }
            });
        
    }

    commonGetHTTPService('Get', '', 'customer/is_logged_in', function (result) {
        $('#loader').show();
        if (result['customer_name']) {
           $rootScope.isLoggedIn = 1; 
           $rootScope.customer_name = result['customer_name']; 
           console.log('logged in status: '+$rootScope.isLoggedIn);
          $location.path("/");
      

        }
    });


});
