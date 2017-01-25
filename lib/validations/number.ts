namespace Dougal.Validations {
  interface _INumberOptions {
    greaterThan?: number
    greaterThanOrEqualTo?: number
    lessThan?: number
    lessThanOrEqualTo?: number
  }

  export type INumberOptions = boolean | _INumberOptions;

  export class NumberValidator extends Validator {
    validate(record: Model, attribute: string, value: any): boolean {
      let parsedValue = parseFloat(value);
      let numberOptions = this.options.number as _INumberOptions;

      if (_.isNaN(parsedValue)) {
        return false;
      }

      let results = {
        greaterThan: value > numberOptions.greaterThan,
        greaterThanOrEqualTo: value >= numberOptions.greaterThanOrEqualTo,
        lessThan: value < numberOptions.lessThan,
        lessThanOrEqualTo: value <= numberOptions.lessThanOrEqualTo
      };

      return _(results)
        .values()
        .without(false)
        .some();
    }
  }
}
