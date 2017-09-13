app.controller('schoolCtrl', function ($scope, $http, $rootScope, toastr, $location) {


    //0:variable decalration
    var baseURL = "http://merikitab.in/meri_kitab/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $scope.loadCount = 1;
    $scope.where = {};
    $scope.filter = {};
   
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

      $scope.listNextSchool = function (index) {
        $('#loader').show();
        var where = JSON.stringify($scope.where);
        commonGetHTTPService('Post', where, 'school/list_school/' + index, function (result) {
            $scope.schoolsData = result['data'];
            $scope.schoolsCount = Math.ceil((result['count'] / 2) + 1);
            $scope.loadCount = $scope.loadCount + 1;
        });
    }
    $scope.listNextSchool(1);

    $scope.listPrevSchool = function (index) {
        $('#loader').show();
        var where = JSON.stringify($scope.where);
        commonGetHTTPService('Post', where, 'school/list_school/' + index, function (result) {
            $scope.schoolsData = result['data'];
            $scope.schoolsCount = Math.ceil((result['count'] / 2) + 1);
            $scope.loadCount = $scope.loadCount - 1;
        });
    }


    // Function to List school city filter
      $scope.listCityFilter = function () {
        $('#loader').show();
        commonGetHTTPService('Get', '', 'city/list_city/', function (result) {
            $scope.cityFilterData = result;
        });
    }
    $scope.listCityFilter();

    // Function to list school type filter
      $scope.listSchoolTypeFilter = function () {
        $('#loader').show();
        commonGetHTTPService('Get', '', 'school_type/list_school_type/', function (result) {
            $scope.schoolTypeFilterData = result;
        });
    }
    $scope.listSchoolTypeFilter();


    // Apply filter on book listing
    $scope.applyFilter = function () {
        var city = [];
        var schoolType = [];

        if ($scope.filter.city) {
            for (var idxOfcity in $scope.filter.city) {
                if ($scope.filter.city[idxOfcity]) {
                    city.push(idxOfcity);
                }
            }
            $scope.where.city = city;
        }

        if ($scope.filter.schoolType) {
            for (var idxOfschoolType in $scope.filter.schoolType) {
                if ($scope.filter.schoolType[idxOfschoolType]) {
                    schoolType.push(idxOfschoolType);
                }
            }
            $scope.where.schoolType = schoolType;
        }

        where = JSON.stringify($scope.where);
        commonGetHTTPService('Post', where, 'school/list_school/' + 1, function (result) {
            $scope.schoolsData = result['data'];
            $scope.schoolsCount = Math.ceil(parseInt((result['count'] / 4)) + 1);
            $scope.loadCount = 1;
        });
    };


});