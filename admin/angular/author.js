app.controller('authorCtrl', function ($scope, $http, $rootScope, toastr) {


    //0:variable decalration
    var baseURL = "http://18.220.55.145/meri_kitaab/index.php/";
    $scope.authorsData = {};
    $scope.authorCount = 0;
    $scope.author = {};
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


    $scope.clearVariables = function () {
        $scope.author = {};
    };
    $scope.addAuthor = function () {
        $('#loader').show();
        $scope.validateData($scope.author, function (result) {
            if (result === 1) {
                commonSetHTTPService('Post', $scope.author, 'author/add_author', function (result) {
                    if (result) {
                        $('#loader').hide();
                        angular.element('#addAuthorModal').modal('hide');
                        commonGetHTTPService('Get', '', 'author/list_author/1', function (result) {
                            $scope.authorsData = result['data'];
                            $scope.authorCount = Math.ceil((result['count'] / 5));
                        });
                    }
                });
            }
        });
    };


    $scope.editAuthor = function (authorId) {
        $('#loader').show();
        $scope.validateData($scope.author, function (result) {
            if (result === 1) {
                commonSetHTTPService('Post', $scope.author, 'author/edit_author', function (result) {
                    if (result) {
                        console.log(result);
                        angular.element('#editAuthorModal').modal('hide');
                        commonGetHTTPService('Get', '', 'author/list_author/1', function (result) {
                            $scope.authorsData = result['data'];
                            $scope.authorCount = Math.ceil((result['count'] / 5));
                        });
                    }
                });
            }
        });
    };

    $scope.deleteAuthor = function (authorId) {
        $('#loader').show();
        $scope.validateData(authorId, function (result) {
            if (result === 1) {
                commonSetHTTPService('POST', '', 'author/delete_author/' + authorId, function (result) {
                    commonGetHTTPService('Get', '', 'author/list_author/1', function (result) {
                        $scope.authorsData = result['data'];
                        $scope.authorCount = Math.ceil((result['count'] / 5));
                    });
                });
            }
        });
    }

    $scope.listAuthor = function (index) {
        $('#loader').show();
        commonGetHTTPService('Get', '', 'author/list_author/' + index, function (result) {
            console.log('authors' + result);
            $scope.authorsData = result['data'];
            $scope.authorCount = Math.ceil((result['count'] / 5));
        });
    }

    $scope.listAuthor(1);

    $scope.getNumber = function (num) {
        return new Array(num);
    }

    $scope.viewAuthor = function (authorId) {
        $('#loader').show();
        $scope.validateData(authorId, function (result) {
            if (result === 1) {
                commonGetHTTPService('Get', '', 'author/view_author/' + authorId, function (result) {
                    $scope.author = result;
                    console.log($scope.author);
                });
            }
        });
    }
    commonGetHTTPService('Get', '', 'admin/is_logged_in', function (result) {
        $rootScope.adminName = result['username'];
        $rootScope.adminLastLogin = result['last_login'];
        $('#loader').show();
        console.log(result);
        if (!result['username']) {
            window.location = "http://18.220.55.145/meri-kitab/admin/signin.html"
        }
    });

    $scope.logout = function () {
        $('#loader').show();
        commonGetHTTPService('Get', '', 'admin/admin_logout', function (result) {
            window.location = "http://18.220.55.145/meri-kitab/admin/signin.html"
        });
    }

});