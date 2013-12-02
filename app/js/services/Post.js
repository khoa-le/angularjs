'use strict';

foodMeApp.factory('Post', function($resource) {
    
  return $resource('/api/post/id/:id', {id: '@id'});
});
