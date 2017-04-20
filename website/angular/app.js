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

var baseUrl = 'http://127.0.0.1:8080/';
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
    })
    .when("/signup", {
        templateUrl : "./views/customer-register.html",
        controller : "signupCtrl"
    })
    .when("/book", {
        templateUrl : "./views/book.html",
        controller : "loginCtrl"
    })
    .when("/blue", {
        templateUrl : "blue.htm"
    });
});