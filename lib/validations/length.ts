namespace Dougal.Validations {
  export interface ILengthOptions {
    minimum?: number,
    maximum?: number,
    is?: number
  }

  export class LengthValidator extends Validator {

    constructor(options?: any) {
      super(options);
    }

    validate(record: Model, attribute: string, value: any) {
      let length = _.size(value);
      let lengthOptions: ILengthOptions = this.options.length;

      let results = {
        is: length !== lengthOptions.is,
        minimum: length < lengthOptions.minimum,
        maximum: length > lengthOptions.maximum
      };

      _.each(results, (valid: boolean, test: string) => {
        if (lengthOptions[test] && valid) {
          record.errors.add(attribute, this.options.message);
        }
      });
    }
  }
}
