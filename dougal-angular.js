(function (angular, Dougal) {
  'use strict';

  angular.module('dougal', [])
    .constant('Dougal', Dougal)
    .factory('$httpStore', ['Dougal', '$http', function (Dougal, $http) {
      return function $httpStore() {
        this.create = function (record) {
          return $http({
            method: 'POST',
            url: record.url(),
            data: record.serializer.format()
          }).then(function (response) {
            return response.data;
          });
        };
      }
    }])
    .run(['Dougal', '$q', function (Dougal, $q) {
      Dougal.Q = $q;
    }]);

})(window.angular, window.Dougal);
