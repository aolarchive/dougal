namespace Dougal.Validations {
  export interface ILengthOptions {
    minimum?: number
    maximum?: number
    is?: number
  }

  export class LengthValidator extends Validator {

    constructor(options?: IValidatorOptions) {
      super(options);
    }

    validate(record: Model, attribute: string, value: any): boolean {
      let length = _.size(value);
      let lengthOptions: ILengthOptions = this.options.length;

      let results = {
        is: length === lengthOptions.is,
        minimum: length >= lengthOptions.minimum,
        maximum: length <= lengthOptions.maximum
      };

      return _(results)
        .values()
        .without(false)
        .some();
    }
  }
}
