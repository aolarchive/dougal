(function (angular, Dougal) {
    'use strict';
    function $httpStoreFactory(Dougal, $http) {
        return (function () {
            function $httpStore() {
            }
            $httpStore.prototype.create = function (record) {
                return $http({
                    method: 'POST',
                    url: record.url(),
                    data: record.serializer.format()
                }).then(function (response) {
                    return response.data;
                });
            };
            $httpStore.prototype.read = function (record) {
                return $http({
                    method: 'GET',
                    url: record.url()
                }).then(function (response) {
                    return response.data;
                });
            };
            $httpStore.prototype.update = function (record) {
                return $http({
                    method: 'POST',
                    url: record.url(),
                    data: record.serializer.format()
                }).then(function (response) {
                    return response.data;
                });
            };
            $httpStore.prototype.delete = function (record) {
                return $http({
                    method: 'DELETE',
                    url: record.url()
                }).then(function (response) {
                    return response.data;
                });
            };
            return $httpStore;
        }());
    }
    angular.module('dougal', [])
        .constant('Dougal', Dougal)
        .factory('$httpStore', ['Dougal', '$http', $httpStoreFactory])
        .run(['Dougal', '$httpStore', '$q', function (Dougal, $httpStore, $q) {
            Dougal.defaultStore = new $httpStore();
            Dougal.Q = $q;
        }]);
})(window['angular'], window['Dougal']);
