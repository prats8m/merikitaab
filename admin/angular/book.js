app.controller('bookCtrl', function ($scope, $http, $rootScope, toastr) {


  //0:variable decalration
  var baseURL = "www.merikitab.com/meri_kitab/index.php/";
  $scope.bookData = {}; //info of book data
  $scope.singleBookData = {};
  $scope.book = {};
  $scope.authorList = {};
  $scope.bookTypeList = {};
  $scope.classList = {};
  $scope.bookPicStatus = 0;
  $scope.publicationList = {};
  $scope.example1model = [{}];
  $scope.example1data = [{}];
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
    callback(1);
  }


  var uploadFile = function (files, bookId) {
    var fd = new FormData();
    fd.append('file', files);
    fd.append('book_id', bookId);
    commonSetHTTPFormService('Post', fd, 'admin_book/upload_book_pic', function (result) {});
  };

  $scope.fetchBookData = function () {
    $scope.example1model = [];
    $scope.example1data = [];
    $scope.bookData = {}; //info of book data
    // $scope.singleBookData = {};
    $scope.book = {};
    $scope.listAuthor(0);
    $scope.listBookType(0);
    $scope.listClass(0);
    $scope.listPublication(0);
    $scope.listSchool(0);
  };


  $scope.listAuthor = function (index) {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'author/list_author/' + index, function (result) {
      $scope.authorList = result['data'];
      console.log($scope.authorList);
    });
  }


  $scope.listBookType = function (index) {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'book_type/list_book_type/' + index, function (result) {
      $scope.bookTypeList = result['data'];
      console.log($scope.bookTypeList);
    });
  }

  $scope.listClass = function (index) {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'classes/list_class/' + index, function (result) {
      $scope.classList = result['data'];
      // console.log($scope.bookTypeList);
    });
  }

  $scope.listPublication = function (index) {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'publication/list_publication/' + index, function (result) {
      $scope.publicationList = result['data'];
      console.log($scope.publicationList);
    });
  }


  $scope.addBook = function () {
    $('#loader').show();
    var count = $scope.example1model.length;
    $scope.book.school = [];
    for (var i = 0; i < count; i++) {
      $scope.book.school[i] = $scope.example1model[i].id;
    }
    console.log("add book: " + JSON.stringify($scope.example1model));
    if ($scope.book.book_status == undefined)
      $scope.book.book_status = false;
    if ($scope.book.book_discount_status == undefined)
      $scope.book.book_discount_status = false;
    var files = document.getElementById('file').files[0];
    $scope.validateData($scope.book, function (result) {
      if (result === 1) {
        commonSetHTTPService('Post', $scope.book, 'admin_book/add_book', function (result) {
          if (result) {
            $('#loader').hide();
            angular.element('#addBookModal').modal('hide');
            uploadFile(files, result['book_id']);
            commonGetHTTPService('Get', '', 'admin_book/list_book/1', function (result) {
              $scope.booksData = result['data'];
              $scope.bookCount = Math.ceil((result['count'] / 5));
            });
          }
        });
      }
    });
  };


  $scope.editBook = function (bookId) {
    $('#loader').show();
    var count = $scope.book.book_school.length;
    var count = $scope.example1model.length;
    $scope.book.school = [];
    for (var i = 0; i < count; i++) {
      $scope.book.school[i] = $scope.example1model[i].id;
    }
    if ($scope.book.book_status == undefined)
      $scope.book.book_status = false;
    if ($scope.book.book_discount_status == undefined)
      $scope.book.book_discount_status = false;
    var files = document.getElementById('file2').files[0];

    $scope.validateData($scope.book, function (result) {
      if (result === 1) {
        commonSetHTTPService('Post', $scope.book, 'admin_book/edit_book', function (result) {
          if (result) {
            console.log(result);
            angular.element('#editBookModal').modal('hide');
            uploadFile(files, result['book_id']);
            commonGetHTTPService('Get', '', 'admin_book/list_book/1', function (result) {
              $scope.booksData = result['data'];
              $scope.bookCount = Math.ceil((result['count'] / 5));
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
          if (result[0].book_status == 1) {
            result[0].book_status = true;
          } else {
            result[0].book_status = false;
          }
          if (result[0].book_discount_status == 1) {
            result[0].book_discount_status = true;
          } else {
            result[0].book_discount_status = false;
          }
          if (result[0].book_pic) {
            $scope.bookPicStatus = 1;
          } else {
            $scope.bookPicStatus = 0;
          }
          var count = result.length;
          $scope.book = result[0];
          $scope.book.book_school = [];
          $scope.singleBookData = result[0];
          $scope.singleBookData['book_publication_year'] = parseInt($scope.singleBookData['book_publication_year']);
          $scope.singleBookData['book_price'] = parseInt($scope.singleBookData['book_price']);
          $scope.singleBookData['book_discount'] = parseInt($scope.singleBookData['book_discount']);


          $scope.schoolData = result;
          for (var i = 0; i < count; i++) {
            console.log(i);
            $scope.example1data[i] = {};
            $scope.example1model[i] = {};
            $scope.example1data[i].id = result[i].school_id;
            $scope.example1data[i].label = result[i].school_name;
            $scope.example1model[i].id = result[i].school_id;
            $scope.example1model[i].label = result[i].school_name;
          }
          console.log('book data::' + JSON.stringify($scope.book));

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
            $scope.bookCount = Math.ceil((result['count'] / 5));
          });
        });
      }
    });
  }

  $scope.listBook = function (index) {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'admin_book/list_book/' + index, function (result) {
      console.log('books' + result);
      $scope.booksData = result['data'];
      $scope.bookCount = Math.ceil((result['count'] / 5));
    });
  }

  $scope.listBook(1);

  $scope.getNumber = function (num) {
    return new Array(num);
  }


  commonGetHTTPService('Get', '', 'admin/is_logged_in', function (result) {
    $rootScope.adminName = result['username'];
    $rootScope.adminLastLogin = result['last_login'];
    $('#loader').show();
    console.log(result);
    if (!result['username']) {
      window.location = "www.merikitab.com/meri-kitab/admin/signin.html"
    }
  });

  $scope.logout = function () {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'admin/admin_logout', function (result) {
      window.location = "www.merikitab.com/meri-kitab/admin/signin.html"
    });
  }

  $scope.listSchool = function (index) {
    $('#loader').show();
    commonGetHTTPService('Get', '', 'admin_school/list_school/' + index, function (result) {
      $scope.schoolCount = result['count'];
      $scope.example1data = result['data'];
      console.log(JSON.stringify($scope.example1data));
    });
  }

});