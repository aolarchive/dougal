namespace Dougal {

  interface ILengthOptions {
    minimum?: number,
    maximum?: number,
    is: number
  }

  export class LengthValidator extends Validator {
    validate(record: any, attribute: string, value: any) {
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

  ValidatorResolver.namedValidators['length'] = LengthValidator;

}
