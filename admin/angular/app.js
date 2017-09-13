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

var baseUrl = 'http://merikitab.in/';
console.log(baseUrl);
var app = angular.module("admin", ['ngRoute','uiSwitch','toastr','angularjs-dropdown-multiselect']).config(function (toastrConfig) {
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
    .when("/school", {
        templateUrl : "./views/school.html",
        controller : "schoolCtrl"
    })
    .when("/login", {
        templateUrl : "./views/signin.html",
        controller : "loginCtrl"
    })
    .when("/book", {
        templateUrl : "./views/book.html",
        controller : "bookCtrl"
    })
    .when("/dashboard", {
        templateUrl : "./views/dashboard.html"
    })
    .when("/author", {
        templateUrl : "./views/author.html",
        controller : "authorCtrl"
    })
    .when("/publication", {
        templateUrl : "./views/publication.html",
        controller : "publicationCtrl"
    })
    .when("/order", {
        templateUrl : "./views/order.html"
    });
});