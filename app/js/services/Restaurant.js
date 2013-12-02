'use strict';

foodMeApp.factory('Restaurant', function($resource) {
  return $resource('/api1/restaurant/:id', {id: '@id'});
});
