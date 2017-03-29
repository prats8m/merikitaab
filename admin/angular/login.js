angular.module('admin', ['toastr']).config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: true,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
}).controller('loginCtrl', function ($scope, toastr, $http) {


    //0:variable decalration
    var baseURL = "http://localhost/meri_kitaab/index.php/";
    $scope.loginData = {};//info of school data
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
                toastr.error(response.data.message, 'Error');
            }
        }, function (error) {
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
        }, function (error) {
            toastr.error(error.data.message, 'Error');
        });
    };
    //end of 1; 


    $scope.validateData = function (data, callback) {
        callback(1);
    }

    $scope.login = function () {
        $scope.loginData.username = $scope.username;
        $scope.loginData.password = $scope.password;
        $scope.validateData($scope.schoolData, function (result) {
            if (result === 1) {
                commonSetHTTPService('Post', $scope.loginData, 'admin/admin_login', function (result) {
                    if (result) {
                        window.location = "http://localhost/meri-kitab/admin/school.html"
                    }
                });
            }
        });
    }

    commonGetHTTPService('Get', '', 'admin/is_logged_in', function (result) {
        if (result) {
            window.location = "http://localhost/meri-kitab/admin/school.html"
        }
    });


});
