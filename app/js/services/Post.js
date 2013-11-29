'use strict';

foodMeApp.factory('Post', function($resource) {
    
  return $resource('/bot/post', {});
});
