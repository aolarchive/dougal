namespace Dougal {
  const Q = window['Q'];

  /**
   * Wrapper to kriskowal's Q promise, to ensure compatibility with Angular's $q.
   */
  export namespace q {
    export function reject(error?: any): Q.Promise<any> {
      const deferred = Q.defer();
      deferred.reject(error);
      return deferred.promise;
    };

    export function when(value?: any): Q.Promise<any> {
      const deferred = Q.defer();
      deferred.resolve(value);
      return deferred.promise;
    };
  };
}
