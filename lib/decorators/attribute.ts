namespace Dougal {
  export function Attribute(prototype, attribute: string, options?: any): void {
    Object.defineProperty(prototype, attribute, {
      get: function () {
        return this.get(attribute);
      },
      set: function (value) {
        this.set(attribute, value);
      }
    });
  };
}
