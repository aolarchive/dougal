namespace Dougal {

  @Extendable
  export abstract class Validator {
    static simple(validate) {
      return class AnonymousValidator extends Validator {
        validate() {
          return validate.apply(this, arguments);
        }
      };
    }

    constructor(protected options: any = {}) {}

    abstract validate(record: any, attribute?: string, value?: any)
  }
}
