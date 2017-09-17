app.controller('bookCtrl', function ($scope, $http, $rootScope, toastr, $location, $window) {


    //0:variable decalration
    var baseURL = "http://18.220.55.145/meri_kitaab/index.php/";
    $scope.loginData = {}; //info of school data
    $rootScope.isLoggedIn = 0;
    $booksData = {};
    $scope.loadCount = 1;
    $scope.schoolFilterData = {};
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


    $scope.listNextBook = function (index) {
        $('#loader').show();
        var where = JSON.stringify($scope.where);
        commonGetHTTPService('Post', where, 'book/list_book/' + index, function (result) {
            $scope.booksData = result['data'];
            $scope.booksCount = Math.ceil((result['count'] / 4) + 1);
            $scope.loadCount = $scope.loadCount + 1;
        });
    }
    $scope.listNextBook(1);

    $scope.listPrevBook = function (index) {
        $('#loader').show();
        var where = JSON.stringify($scope.where);
        commonGetHTTPService('Post', where, 'book/list_book/' + index, function (result) {
            $scope.booksData = result['data'];
            $scope.booksCount = Math.ceil((result['count'] / 4) + 1);
            $scope.loadCount = $scope.loadCount - 1;
        });
    }

    $scope.listSchoolFilter = function (limit) {
        $('#loader').show();
        $scope.schoolFilterData = [];
        commonGetHTTPService('Get', '', 'school/list_school_filter/', function (result) {
            // $scope.schoolFilterData = result;
            $scope.schoolFilterButtonStatus = 1;
            if (result.length < limit) {
                $scope.schoolFilterButtonStatus = 0;
            }
            if (limit != 0) {
                $scope.schoolFilterButtonName = "See More";
                $scope.schoolFilterButtonValue = 0;
                for (var idx = 0; idx < limit && idx < result.length; idx++) {
                    $scope.schoolFilterData.push(result[idx]);
                }
            } else {
                $scope.schoolFilterData = result['data'];
                $scope.schoolFilterButtonName = "Minimize";
                $scope.schoolFilterButtonValue = 5;
            }
        });
    }
    $scope.listSchoolFilter(5);

    $scope.listClassFilter = function (limit) {
        $('#loader').show();
        $scope.classFilterData = [];
        commonGetHTTPService('Get', '', 'classes/list_class/', function (result) {
            $scope.classFilterButtonStatus = 1;
            if (result['data'].length < limit) {
                $scope.classFilterButtonStatus = 0;
            }
            if (limit != 0) {
                $scope.classFilterButtonName = "See More";
                $scope.classFilterButtonValue = 0;
                for (var idx = 0; idx < limit; idx++) {
                    $scope.classFilterData.push(result['data'][idx]);
                }
            } else {
                $scope.classFilterData = result['data'];
                $scope.classFilterButtonName = "Minimize";
                $scope.classFilterButtonValue = 5;
            }
        });
    }
    $scope.listClassFilter(5);


    $scope.listBookTypeFilter = function (limit) {
        $('#loader').show();
        $scope.bookTypeFilterData = [];
        commonGetHTTPService('Get', '', 'book_type/list_book_type/', function (result) {
            $scope.bookTypeFilterButtonStatus = 1;
            if (result['data'].length < limit) {
                $scope.bookTypeFilterButtonStatus = 0;
            }
            if (limit != 0) {
                $scope.bookTypeFilterButtonName = "See More";
                $scope.bookTypeFilterButtonValue = 0;
                for (var idx = 0; idx < limit; idx++) {
                    $scope.bookTypeFilterData.push(result['data'][idx]);
                }
            } else {
                $scope.bookTypeFilterData = result['data'];
                $scope.bookTypeFilterButtonName = "Minimize";
                $scope.bookTypeFilterButtonValue = 5;
            }
        });
    }
    $scope.listBookTypeFilter(5);


    $scope.listAuthorFilter = function (limit) {
        $('#loader').show();
        $scope.authorFilterData = [];
        commonGetHTTPService('Get', '', 'author/list_author', function (result) {
            $scope.authorFilterButtonStatus = 1;
            if (result['data'].length < limit) {
                $scope.authorFilterButtonStatus = 0;
            }
            if (limit != 0) {
                $scope.authorFilterButtonName = "See More";
                $scope.authorFilterButtonValue = 0;
                for (var idx = 0; idx < limit; idx++) {
                    $scope.authorFilterData.push(result['data'][idx]);
                }
            } else {
                $scope.authorFilterData = result['data'];
                $scope.authorFilterButtonName = "Minimize";
                $scope.authorFilterButtonValue = 5;
            }
        });
    }
    $scope.listAuthorFilter(5);


    // Apply filter on book listing
    $scope.applyFilter = function () {
        var school = [];
        var classes = [];
        var author = [];
        var bookType = [];

        if ($scope.filter.school) {
            for (var idxOfSchool in $scope.filter.school) {
                if ($scope.filter.school[idxOfSchool]) {
                    school.push(idxOfSchool);
                }
            }
            $scope.where.school = school;
        }

        if ($scope.filter.classes) {
            for (var idxOfClass in $scope.filter.classes) {
                if ($scope.filter.classes[idxOfClass]) {
                    classes.push(idxOfClass);
                }
            }
            $scope.where.class = classes;
        }


        if ($scope.filter.author) {
            for (var idxOfAuthor in $scope.filter.author) {
                if ($scope.filter.author[idxOfAuthor]) {
                    author.push(idxOfAuthor);
                }
            }
            $scope.where.author = author;
        }


        if ($scope.filter.bookType) {
            for (var idxOfBookType in $scope.filter.bookType) {
                if ($scope.filter.bookType[idxOfBookType]) {
                    bookType.push(idxOfAuthor);
                }
            }
            $scope.where.type = bookType;
        }



        where = JSON.stringify($scope.where);
        commonGetHTTPService('Post', where, 'book/list_book/' + 1, function (result) {
            console.log('fetched books ' + result + " end");
            $scope.booksData = result['data'];
            $scope.booksCount = Math.ceil(parseInt((result['count'] / 4)) + 1);
            $scope.loadCount = 1;
        });
    };

});