'use strict';

foodMeApp.controller('PostController',
        function PostController($scope, $routeParams, Post) {

            var posts = Post.get({id: $routeParams.postId});
           
            
            $scope.post = posts;            
            $scope.postindex = $scope.post.length;
            $scope.postid= $routeParams.postId;


        });
