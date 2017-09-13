'use strict';
/**
 * @ngdoc overview
 * @name minovateApp
 * @description
 * # minovateApp
 *
 * Main module of the application.
 */

  /*jshint -W079 */

var baseUrl = 'www.merikitab.com/';
console.log(baseUrl);
var app = angular.module("website", ['ngRoute','toastr']).config(function (toastrConfig) {
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
});


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "./views/index.html"
        // controller : "appCtrl"
    })
    .when("/signup", {
        templateUrl : "./views/customer-register.html",
        controller : "signupCtrl"
    })
    .when("/school", {
        templateUrl : "./views/school_list.html",
        controller : "schoolCtrl"
    })
    .when("/schoolsBook", {
        templateUrl : "./views/school_book_list.html",
        controller : "schoolCtrl"
    })
    .when("/viewBook", {
        templateUrl : "./views/view_book.html",
        controller : "viewBookCtrl"
    })
    .when("/book", {
        templateUrl : "./views/book_list.html",
        controller : "bookCtrl"
    })
    .otherwise({
        templateUrl : "./views/404.html",
      });
});


