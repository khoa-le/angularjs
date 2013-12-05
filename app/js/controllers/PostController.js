'use strict';

foodMeApp.controller('PostController',
        function PostController($scope, $routeParams, Post) {
            $scope.$emit('LOAD');
            var posts = Post.get({id: $routeParams.postId},function(){
                $scope.$emit('UNLOAD');
            });
            $scope.post = posts;            
            $scope.postindex = $scope.post.length;
            $scope.postid= $routeParams.postId;

        }).controller('AppController',['$scope',function($scope){
                
                $scope.$on('LOAD',function(){
                    $scope.loading=true;
                });
                $scope.$on('UNLOAD',function(){
                    $scope.loading=false;
                });
        }]);
