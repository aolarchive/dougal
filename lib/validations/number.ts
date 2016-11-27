namespace Dougal.Validations {
  interface _INumberOptions {
    greaterThan?: number
    greaterThanOrEqualTo?: number
    lessThan?: number
    lessThanOrEqualTo?: number
  }

  export type INumberOptions = boolean | _INumberOptions;

  export class NumberValidator extends Validator {
    validate(record: Model, attribute: string, value: any) {
      let parsedValue = parseFloat(value);
      let numberOptions = this.options.number as _INumberOptions;

      if (_.isNaN(parsedValue)) {
        record.errors.add(attribute, this.options.message);
      }

      let results = {
        greaterThan: value > numberOptions.greaterThan,
        greaterThanOrEqualTo: value >= numberOptions.greaterThanOrEqualTo,
        lessThan: value < numberOptions.lessThan,
        lessThanOrEqualTo: value <= numberOptions.lessThanOrEqualTo
      };

      _.each(results, (valid: boolean, test: string) => {
        if (numberOptions[test] && !valid) {
          record.errors.add(attribute, this.options.message);
        }
      });
    }
  }
}
