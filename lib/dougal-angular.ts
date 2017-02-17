((angular, Dougal) => {
  'use strict';

  /// <reference types="angular" />
  /// <reference path="./store.ts" />

  function $httpStoreFactory(Dougal, $http) {
    return class $httpStore implements Dougal.Store {
      list(url: string, args: any) {
        return $http({
          method: 'GET',
          url: url,
          params: args
        }).then((response) => {
          return response.data;
        });
      }

      create(record: Dougal.Model) {
        return $http({
          method: 'POST',
          url: record.url(),
          data: record.toJson()
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

      update(record: Dougal.Model) {
        return $http({
          method: 'PUT',
          url: record.url(),
          data: record.toJson()
        }).then((response) => {
          return response.data;
        });
      }

      delete(record: Dougal.Model) {
        return $http({
          method: 'DELETE',
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
    .run(['Dougal', '$httpStore', '$q', (Dougal, $httpStore, $q) => {
      Dougal.Config.defaultStore = new $httpStore();
      Dougal.q = $q;
    }]);

})(window['angular'], window['Dougal']);
