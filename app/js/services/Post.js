'use strict';

foodMeApp.factory('Post', function($resource) {
    
  return $resource('/data/posts.json', {id: '@id'});
});
