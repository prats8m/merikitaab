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
  //end of 0


  //1:command ajax calling function
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
      callback(response.data.data);
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
    $scope.validateData($scope.schoolData, function (result) {
      if (result === 1) {
        commonSetHTTPService('Post', $scope.schoolData, 'admin_school/add_school', function (result) {
          if (result) {
            angular.element('#addSchoolModal').modal('hide');
            commonSetHTTPService('Get', '', 'admin_school/list_school', function (result) {
              $scope.schoolsData = result;
            });
          }
        });
      }
    });
  };

  commonSetHTTPService('Get', '', 'admin_school/list_school', function (result) {
    $scope.schoolsData = result;
  });
});
