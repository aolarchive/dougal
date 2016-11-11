function extendable(BaseClass) {
  BaseClass.extends = function (constructor: Function, prototype: any) {
    function Extended() {
      BaseClass.apply(this);
      constructor.apply(this);
    }

    Extended.prototype = Object.create(BaseClass.prototype, {
      constructor: Extended
    });
    _.assign(Extended.prototype, prototype);

    return Extended;
  }
}
