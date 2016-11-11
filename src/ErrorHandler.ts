namespace Dougal {
  export class ErrorHandler {
    errorMessages: any = {};

    add(attribute, message) {
      if (_.isUndefined(this.errorMessages[attribute])) {
        this.errorMessages[attribute] = [];
        Object.defineProperty(this, attribute, {
          get: () => {
            return this.errorMessages[attribute];
          }
        })
      }
      this.errorMessages[attribute].push(message);
    }

    any() {
      return _(this.errorMessages)
        .values()
        .flatten()
        .isEmpty();
    }
  }
}
