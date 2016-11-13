function Extendable(BaseClass) {
  BaseClass.extends = function (constructor: Function, prototype: any) {
    function Extended() {
      BaseClass.apply(this, arguments);
      constructor.apply(this, arguments);
    }

    Extended.prototype = Object.create(BaseClass.prototype, {
      constructor: Extended
    });
    _.assign(Extended.prototype, prototype);

    return Extended;
  }
}
