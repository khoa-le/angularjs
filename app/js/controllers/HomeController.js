'use strict';

foodMeApp.controller('HomeController',
        function HomeController($scope, customer, $location, Post) {

            var allposts = Post.query();
            $scope.posts=allposts;

        });