app.controller('publicationCtrl', function ($scope, $http, $rootScope, toastr) {


    //0:variable decalration
    var baseURL = "http://18.220.55.145/meri_kitaab/index.php/";
    $scope.publicationsData = {};
    $scope.publicationCount = 0;
    $scope.publication = {};
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
        $scope.publication = {};
    };
    $scope.addPublication = function () {
        $('#loader').show();
        $scope.validateData($scope.publication, function (result) {
            if (result === 1) {
                commonSetHTTPService('Post', $scope.publication, 'publication/add_publication', function (result) {
                    if (result) {
                        $('#loader').hide();
                        angular.element('#addPublicationModal').modal('hide');
                        commonGetHTTPService('Get', '', 'publication/list_publication/1', function (result) {
                            $scope.publicationsData = result['data'];
                            $scope.publicationCount = Math.ceil((result['count'] / 5));
                        });
                    }
                });
            }
        });
    };


    $scope.editPublication = function (publicationId) {
        $('#loader').show();
        $scope.validateData($scope.publication, function (result) {
            if (result === 1) {
                commonSetHTTPService('Post', $scope.publication, 'publication/edit_publication', function (result) {
                    if (result) {
                        console.log(result);
                        angular.element('#editPublicationModal').modal('hide');
                        commonGetHTTPService('Get', '', 'publication/list_publication/1', function (result) {
                            $scope.publicationsData = result['data'];
                            $scope.publicationCount = Math.ceil((result['count'] / 5));
                        });
                    }
                });
            }
        });
    };

    $scope.deletePublication = function (publicationId) {
        $('#loader').show();
        $scope.validateData(publicationId, function (result) {
            if (result === 1) {
                commonSetHTTPService('POST', '', 'publication/delete_publication/' + publicationId, function (result) {
                    commonGetHTTPService('Get', '', 'publication/list_publication/1', function (result) {
                        $scope.publicationsData = result['data'];
                        $scope.publicationCount = Math.ceil((result['count'] / 5));
                    });
                });
            }
        });
    }

    $scope.listPublication = function (index) {
        $('#loader').show();
        commonGetHTTPService('Get', '', 'publication/list_publication/' + index, function (result) {
            console.log('publications' + result);
            $scope.publicationsData = result['data'];
            $scope.publicationCount = Math.ceil((result['count'] / 5));
        });
    }

    $scope.listPublication(1);

    $scope.getNumber = function (num) {
        return new Array(num);
    }

    $scope.viewPublication = function (publicationId) {
        $('#loader').show();
        $scope.validateData(publicationId, function (result) {
            if (result === 1) {
                commonGetHTTPService('Get', '', 'publication/view_publication/' + publicationId, function (result) {
                    $scope.publication = result;
                    console.log($scope.publication);
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