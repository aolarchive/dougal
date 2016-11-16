(function (angular, Dougal) {
  'use strict';

  angular.module('dougal', [])
    .constant('Dougal', Dougal)
    .config(['Dougal', '$q', function (Dougal, $q) {
      Dougal.Q = $q;
    }]);

})(window.angular, window.Dougal);
