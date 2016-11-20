namespace Dougal {
  export function Extendable(BaseClass) {
    BaseClass.extends = function (constructor: Function) {
      function Extended() {
        BaseClass.apply(this, arguments);
        constructor.apply(this, arguments);
      }

      Extended.prototype = Object.create(BaseClass.prototype, {
        constructor: Extended
      });

      return Extended;
    }
  }
}
