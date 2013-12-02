'use strict';

foodMeApp.controller('PostController',
    function PostController($scope, $routeParams, Post) {

    $scope.post= Post.get({id: $routeParams.postId});


});
