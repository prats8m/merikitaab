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
}).controller('schoolCtrl', function ($scope, toastr, $http) {


  //0:variable decalration
  var baseURL = "http://localhost/meri_kitaab/index.php/";
  $scope.schoolData = {};//info of school data
  $scope.singleSchoolData = {};
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

  $scope.addSchool = function () {
    $scope.schoolData.name = $scope.name;
    $scope.schoolData.city = $scope.city;
    $scope.schoolData.contact1 = $scope.contact1;
    $scope.schoolData.contact2 = $scope.contact2;
    $scope.schoolData.contact3 = $scope.contact3;
    $scope.schoolData.status = $scope.status;
    $scope.schoolData.address = $scope.address;
    $scope.validateData($scope.schoolData, function (result) {
      if (result === 1) {
        commonSetHTTPService('Post', $scope.schoolData, 'admin_school/add_school', function (result) {
          if (result) {
            angular.element('#addSchoolModal').modal('hide');
            commonGetHTTPService('Get', '', 'admin_school/list_school/1', function (result) {
              $scope.schoolsData = result['data'];
              $scope.schoolCount = Math.ceil((result['count'].length / 5) + 1);
            });
          }
        });
      }
    });
  };


  $scope.editSchool = function (schoolId) {
    $scope.schoolData.school_id = schoolId;
    $scope.schoolData.name = $scope.singleSchoolData.school_name;
    $scope.schoolData.city = $scope.singleSchoolData.school_city;
    $scope.schoolData.contact1 = $scope.singleSchoolData.contact1;
    $scope.schoolData.contact2 = $scope.singleSchoolData.contact2;
    $scope.schoolData.contact3 = $scope.singleSchoolData.contact3;
    $scope.schoolData.status = $scope.singleSchoolData.school_status;
    $scope.schoolData.address = $scope.singleSchoolData.school_address;
    console.log($scope.schoolData);
    $scope.validateData($scope.schoolData, function (result) {
      if (result === 1) {
        commonSetHTTPService('Post', $scope.schoolData, 'admin_school/edit_school', function (result) {
          if (result) {
            angular.element('#editSchoolModal').modal('hide');
            commonGetHTTPService('Get', '', 'admin_school/list_school/1', function (result) {
              $scope.schoolsData = result['data'];
              $scope.schoolCount = Math.ceil((result['count'].length / 5) + 1);
            });
          }
        });
      }
    });
  };

  $scope.viewSchool = function (schoolId) {
    $scope.validateData($scope.schoolData, function (result) {
      if (result === 1) {
        commonGetHTTPService('Get', '', 'admin_school/view_school/' + schoolId, function (result) {
          $scope.singleSchoolData = result;
        });
      }
    });
  }


  $scope.deleteSchool = function (schoolId) {
    $scope.validateData($scope.schoolData, function (result) {
      if (result === 1) {
        commonSetHTTPService('POST', '', 'admin_school/delete_school/' + schoolId, function (result) {
          commonGetHTTPService('Get', '', 'admin_school/list_school/1', function (result) {
            $scope.schoolsData = result['data'];
            $scope.schoolCount = Math.ceil((result['count'].length / 5) + 1);
          });
        });
      }
    });
  }

  $scope.listSchool = function (index) {
    commonGetHTTPService('Get', '', 'admin_school/list_school/' + index, function (result) {
      $scope.schoolsData = result['data'];
      $scope.schoolCount = Math.ceil((result['count'] / 5) + 1);
    });
  }

  $scope.listSchool(1);

  $scope.getNumber = function (num) {
    return new Array(num);
  }


  commonGetHTTPService('Get', '', 'admin/is_logged_in', function (result) {
    $scope.adminName = result;
    console.log($scope.adminName);
    if (!result) {
      window.location = "http://localhost/meri-kitab/admin/signin.html"
    }
  });

  $scope.logout = function () {
    commonGetHTTPService('Get', '', 'admin/admin_logout', function (result) {
      window.location = "http://localhost/meri-kitab/admin/signin.html"
    });
  }
});
