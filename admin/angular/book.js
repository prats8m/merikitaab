app.controller('bookCtrl', function ($scope, $http,$rootScope) {


  //0:variable decalration
  var baseURL = "http://localhost/meri_kitaab/index.php/";
  $scope.bookData = {};//info of book data
  $scope.singleBookData = {};
  $scope.book = {};
  $scope.options = [
    {
      "id": 22,
      "name": "abc",
      "capital": "Paris"
    },
    {
      "id": 21,
      "name": "abc",
      "capital": "London"
    },
    {
      "id": 20,
      "name": "abc",
      "capital": "Berlin"
    }
  ];
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
        //toastr.success(response.data.message, 'Success');
        callback(1);
      }
      if (response.data.status == false) {
        //toastr.error(response.data.message, 'Error');
      }
      $('#loader').hide();
    }, function (error) {
      $('#loader').hide();
      //toastr.error(error.data.message, 'Error');
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
        //toastr.error(response.data.message, 'Error');
      }
      $('#loader').hide();
    }, function (error) {
      $('#loader').hide();
      //toastr.error(error.data.message, 'Error');
    });
  };
  //end of 1; 


  $scope.validateData = function (data, callback) {
    callback(1);
  }

  $scope.addBook = function () {
    console.log($scope.book);
    $('#loader').show();
    var count = $scope.book.book_school.length;
    $scope.book.school = [];
    for (var i = 0; i < count; i++) {
      $scope.book.school[i] = $scope.book.book_school[i].id;
    }
    if ($scope.book.book_status == undefined)
      $scope.book.book_status = false;
    if ($scope.book.book_discount_status == undefined)
      $scope.book.book_discount_status = false;
    $scope.validateData($scope.book, function (result) {
      if (result === 1) {
        commonSetHTTPService('Post', $scope.book, 'admin_book/add_book', function (result) {
          if (result) {
            angular.element('#addBookModal').modal('hide');
            commonGetHTTPService('Get', '', 'admin_book/list_book/1', function (result) {
              $scope.booksData = result['data'];
              $scope.bookCount = Math.ceil((result['count'].length / 5) + 1);
            });
          }
        });
      }
    });
  };


  $scope.editBook = function (bookId) {
    $('#loader').show();
    var count = $scope.book.book_school.length;
    $scope.book.school = [];
    for (var i = 0; i < count; i++) {
      $scope.book.school[i] = $scope.book.book_school[i].id;
    }
    if ($scope.book.book_status == undefined)
      $scope.book.book_status = false;
    if ($scope.book.book_discount_status == undefined)
      $scope.book.book_discount_status = false;
    $scope.validateData($scope.book, function (result) {
      if (result === 1) {
        commonSetHTTPService('Post', $scope.book, 'admin_book/edit_book', function (result) {
          if (result) {
            angular.element('#editBookModal').modal('hide');
            commonGetHTTPService('Get', '', 'admin_book/list_book/1', function (result) {
              $scope.booksData = result['data'];
              $scope.bookCount = Math.ceil((result['count'].length / 5) + 1);
            });
          }
        });
      }
    });
  };

  $scope.viewBook = function (bookId) {
    $('#loader').show();
    $scope.validateData(bookId, function (result) {
      if (result === 1) {
        commonGetHTTPService('Get', '', 'admin_book/view_book/' + bookId, function (result) {
          if(result[0].book_status == 1){
            result[0].book_status = true;
          }
          else{
            result[0].book_status = false;
          }
          if(result[0].book_discounted_status == 1){
            result[0].book_discounted_status = true;
          }
          else{
            result[0].book_discounted_status = false;
          }
          var count = result.length;
          $scope.book=result[0];
          $scope.book.book_school=[];
          $scope.singleBookData = result[0];
          $scope.schoolData = result;
          
          for(var i=0;i<count;i++){
            console.log(i);
            $scope.book.book_school[i]={};
            $scope.book.book_school[i].id=result[i].school_id;
            $scope.book.book_school[i].name='abc';
        }
          console.log('book data::'+ JSON.stringify($scope.book));

        });
      }
    });
  }


  $scope.deleteBook = function (bookId) {
    $('#loader').show();
    $scope.validateData(bookId, function (result) {
      if (result === 1) {
        commonSetHTTPService('POST', '', 'admin_book/delete_book/' + bookId, function (result) {
          commonGetHTTPService('Get', '', 'admin_book/list_book/1', function (result) {
            $scope.booksData = result['data'];
            $scope.bookCount = Math.ceil((result['count'].length / 5) + 1);
          });
        });
      }
    });
  }

  $scope.listBook = function (index) {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'admin_book/list_book/' + index, function (result) {
      console.log('books'+ result);
      $scope.booksData = result['data'];
      $scope.bookCount = Math.ceil((result['count'] / 5) + 1);
    });
  }

  $scope.listBook(1);

  $scope.getNumber = function (num) {
    return new Array(num);
  }


  commonGetHTTPService('Get', '', 'admin/is_logged_in', function (result) {
    $rootScope.adminName = result['username'];
    $rootScope.adminLastLogin=result['last_login'];
    $('#loader').show();
    console.log(result);
    if (!result['username']) {
      window.location = "http://localhost/meri-kitab/admin/signin.html"
    }
  });

  $scope.logout = function () {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'admin/admin_logout', function (result) {
      window.location = "http://localhost/meri-kitab/admin/signin.html"
    });
  }
});
