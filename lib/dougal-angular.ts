((angular, Dougal) => {
  'use strict';

  /// <reference types="angular" />
  /// <reference path="./store.ts" />

  function $httpStoreFactory(Dougal, $http) {
    return class $httpStore implements Dougal.Store {
      create(record: Dougal.Model) {
        return $http({
          method: 'POST',
          url: record.url(),
          data: record.serializer.format()
        }).then((response) => {
          return response.data;
        });
      }

      read(record: Dougal.Model) {
        return $http({
          method: 'GET',
          url: record.url()
        }).then((response) => {
          return response.data;
        });
      }
    }
  }

  angular.module('dougal', [])
    .constant('Dougal', Dougal)
    .factory('$httpStore', ['Dougal', '$http', $httpStoreFactory])
    .run(['Dougal', '$q', (Dougal, $q) => {
      Dougal.Q = $q;
    }]);

})(window.angular, window.Dougal);
