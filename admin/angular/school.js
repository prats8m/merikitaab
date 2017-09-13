  app.controller('schoolCtrl', function ($scope, $http, $location, $rootScope, toastr) {

    console.log('prtk');
    //0:variable decalration
    var baseURL = "http://merikitab.in/meri_kitab/index.php/";
    $scope.schoolData = {}; //info of school data
    $scope.singleSchoolData = {};
    // $scope.headerTemp='./header.html';
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



    //1:command set ajax calling function
    var commonSetHTTPFormService = function (method, data, url, callback) {
      $http({
        method: method,
        url: baseURL + url,
        data: data,
        headers: {
          'Content-Type': undefined
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
        $('#loader').hide();
      }, function (error) {
        $('#loader').hide();
        toastr.error(error.data.message, 'Error');
      });
    };
    //end of 1; 


    $scope.validateData = function (data, callback) {
      if (data.contact1 === undefined) {
        toastr.error("Contact is not valid", 'Error');
        $('#loader').hide();
        callback(0);
      }
      else{
      callback(1);
      }
    }

    var uploadFile = function (files, schoolId) {
      var fd = new FormData();
      fd.append('file', files);
      fd.append('school_id', schoolId);
      commonSetHTTPFormService('Post', fd, 'admin_school/upload_school_pic', function (result) {});
    };


    $scope.addSchool = function () {
      $scope.schoolData.name = $scope.name;
      $scope.schoolData.city = $scope.city;
      $scope.schoolData.contact1 = $scope.contact1;
      // $scope.schoolData.contact2 = $scope.contact2;
      // $scope.schoolData.contact3 = $scope.contact3;
      if ($scope.status)
        $scope.schoolData.status = $scope.status;
      else
        $scope.schoolData.status = 0;

      $scope.schoolData.address = $scope.address;
      $scope.schoolData.nos = $scope.nos;
      var files = document.getElementById('file').files[0];
      $('#loader').show();
      $scope.validateData($scope.schoolData, function (result) {
        if (result == 1) {
          commonSetHTTPService('Post', $scope.schoolData, 'admin_school/add_school', function (result) {
            if (result) {
              angular.element('#addSchoolModal').modal('hide');
              uploadFile(files, result['school_id']);
              commonGetHTTPService('Get', '', 'admin_school/list_school/1', function (result) {
                $scope.schoolsData = result['data'];
                $scope.schoolCount = Math.ceil((result['count'] / 5) );
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
      // $scope.schoolData.contact2 = $scope.singleSchoolData.contact2;
      // $scope.schoolData.contact3 = $scope.singleSchoolData.contact3;
      $scope.schoolData.status = $scope.singleSchoolData.school_status;
      $scope.schoolData.address = $scope.singleSchoolData.school_address;
      $scope.schoolData.nos = $scope.singleSchoolData.school_number_of_student;
      var files = document.getElementById('file2').files[0];
      $('#loader').show();
      $scope.validateData($scope.schoolData, function (result) {
        if (result === 1) {
          commonSetHTTPService('Post', $scope.schoolData, 'admin_school/edit_school', function (result) {
            if (result) {
              angular.element('#editSchoolModal').modal('hide');
              uploadFile(files, result['school_id']);
              commonGetHTTPService('Get', '', 'admin_school/list_school/1', function (result) {
                $scope.schoolsData = result['data'];
                $scope.schoolCount = Math.ceil((result['count'] / 5));
              });
            }
          });
        }
      });
    };



    $scope.viewSchool = function (schoolId) {
      $('#loader').show();
          commonGetHTTPService('Get', '', 'admin_school/view_school/' + schoolId, function (result) {
            console.log('result' + JSON.stringify(result));
            if (result.school_status == 1) {
              result.school_status = true;
            } else {
              result.school_status = false;
            }
            $scope.singleSchoolData = result;
          });
    }


    $scope.deleteSchool = function (schoolId) {
      $('#loader').show();
          commonSetHTTPService('POST', '', 'admin_school/delete_school/' + schoolId, function (result) {
            commonGetHTTPService('Get', '', 'admin_school/list_school/1', function (result) {
              $scope.schoolsData = result['data'];
              $scope.schoolCount = Math.ceil((result['count'].length / 5));
            });
          });
    }

    $scope.listSchool = function (index) {
      $('#loader').show();
      commonGetHTTPService('Get', '', 'admin_school/list_school/' + index, function (result) {
        $scope.schoolsData = result['data'];
        $scope.schoolCount = Math.ceil((result['count'] / 5));
        console.log($scope.schoolCount);
      });
    }

    $scope.listSchool(1);

    $scope.getNumber = function (num) {
      return new Array(num);
    }


    commonGetHTTPService('Get', '', 'admin/is_logged_in', function (result) {
      $rootScope.adminName = result['username'];
      $rootScope.adminLastLogin = result['last_login'];
      $('#loader').show();
      console.log(result);
      if (!result['username']) {
        $location.path('/login');
      }
    });

    $scope.logout = function () {
      $('#loader').show();
      commonGetHTTPService('Get', '', 'admin/admin_logout', function (result) {
        $location.path('/login');
      });
    }
  });