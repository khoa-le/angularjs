'use strict';

foodMeApp.controller('HomeController',
        function HomeController($scope, $location, Post) {
            $scope.posts = Post.query();
            $scope.indexpost = 100;                        

        });