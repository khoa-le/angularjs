'use strict';


var foodMeApp = angular.module('foodMeApp', ['ngResource','ngMobile','ngRoute','angular-carousel']);

foodMeApp.config(function($routeProvider) {

  $routeProvider.
      when('/', {
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      }).
      when('/restaurants', {
        controller: 'RestaurantsController',
        templateUrl: 'views/restaurants.html'
      }).
      when('/menu/:restaurantId', {
        controller: 'MenuController',
        templateUrl: 'views/menu.html'
      }).
      when('/post/:postId', {
        controller: 'PostController',
        templateUrl: 'views/post.html'
      }).
      when('/checkout', {
        controller: 'CheckoutController',
        templateUrl: 'views/checkout.html'
      }).
      when('/thank-you', {
        controller: 'ThankYouController',
        templateUrl: 'views/thank-you.html'
      }).
      when('/customer', {
        controller: 'CustomerController',
        templateUrl: 'views/customer.html'
      }).
      when('/who-we-are', {
        templateUrl: 'views/who-we-are.html'
      }).
      when('/how-it-works', {
        templateUrl: 'views/how-it-works.html'
      }).
      when('/help', {
        templateUrl: 'views/help.html'
      });
});
