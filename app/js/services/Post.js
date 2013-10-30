'use strict';

foodMeApp.factory('Post', function($resource) {
  return $resource('https://dragonten.sgcharo.com/api/card?method=get&id=:id', {id: '@id'});
});
