namespace Dougal {
  export class AttributeValidator {
    static extends(validateFn: Function) {
      return class ExtendedAttributeValidator extends AttributeValidator {
        validate(record: any, attribute: string, value: any) {
          return validateFn.apply(this, arguments);
        }
      }
    }

    options: any;

    constructor(options) {
      this.options = options || {};
    }
    
    validate(record: any, attribute: string, value: any) {}
  }
}
