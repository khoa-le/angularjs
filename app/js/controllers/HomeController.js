'use strict';

foodMeApp.controller('HomeController',
        function HomeController($scope, $location, Post) {
            $scope.$emit('LOAD');
            $scope.posts = Post.query(function() {
                $scope.$emit('UNLOAD');
            });
            $scope.indexpost = 100;                        

        }).controller('AppController',['$scope',function($scope){
                
                $scope.$on('LOAD',function(){
                    $scope.loading=true;
                });
                $scope.$on('UNLOAD',function(){
                    $scope.loading=false;
                });
        }]);