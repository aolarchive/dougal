namespace Dougal.Validations {
  export class ErrorHandler {
    messages: any = {};

    constructor(record: Dougal.Model) {
      _(record.attributes)
        .keys()
        .each((key) => {
          this.init(key);
        });
    }

    add(attribute, message) {
      if (_.isUndefined(this.messages[attribute])) {
        this.init(attribute);
      }
      if (_.includes(this.messages[attribute], message)) {
        return;
      }
      this.messages[attribute].push(message);
    }

    any() {
      return !_(this.messages)
        .values()
        .flatten()
        .isEmpty();
    }

    init(attribute: string) {
      this.messages[attribute] = [];
      Object.defineProperty(this, attribute, {
        get: () => {
          return this.messages[attribute];
        }
      });
    }
  }
}
