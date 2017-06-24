app.controller('bookCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://localhost/meri_kitaab/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $booksData = {};
    $scope.loadCount = 1;
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


    $scope.listNextBook = function (index) {
        $('#loader').show();
        commonGetHTTPService('Get', '', 'book/list_book/' + index, function (result) {
            console.log('books' + result);
            $scope.booksData = result['data'];
            $scope.booksCount = Math.ceil((result['count'] / 4) + 1);
            $scope.loadCount = $scope.loadCount + 1;
        });
    }

     $scope.listPrevBook = function (index) {
        $('#loader').show();
        commonGetHTTPService('Get', '', 'book/list_book/' + index, function (result) {
            console.log('books' + result);
            $scope.booksData = result['data'];
            $scope.booksCount = Math.ceil((result['count'] / 4) + 1);
            $scope.loadCount = $scope.loadCount - 1;
        });
    }

    $scope.listNextBook(1);
});