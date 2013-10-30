'use strict';

foodMeApp.controller('HomeController',
        function HomeController($scope, customer, $location, Post) {

            var posts = Post.get({id:1});
console.log(posts);
            $scope.customerName = customer.name;
            $scope.customerAddress = customer.address;


            $scope.findRestaurants = function(customerName, customerAddress) {
                customer.name = customerName;
                customer.address = customerAddress;

                
            };
        });