namespace Dougal {

  export interface IValidatorOptions {
    message: string
    length?: Validations.ILengthOptions
    number?: Validations.INumberOptions
    presence?: Validations.IPresenceOptions
  }

  @Extendable
  export abstract class Validator {
    static simple(validate) {
      return class AnonymousValidator extends Validator {
        validate() {
          return validate.apply(this, arguments);
        }
      };
    }

    constructor(protected options?: IValidatorOptions) {}

    abstract validate(record: Model, attribute?: string, value?: any): boolean

    get message(): string {
      return this.options.message;
    }
  }
}
