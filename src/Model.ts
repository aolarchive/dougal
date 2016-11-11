///<reference path="../node_modules/@types/lodash/index.d.ts" />

namespace Dougal {

  interface Attribute {
    name?: string,
    get?: Function,
    set?: Function
  }

  type Validator = AttributeValidator | Function;

  export const BasicValidators = {
    presence: function (value: any) {
      return _.isEmpty(value);
    }
  }

  @extendable
  export abstract class Model {

    attributes: any = {};
    errors: ErrorHandler = new ErrorHandler();
    validators: any = {};

    protected attribute(name: string, options: Attribute = {}) {
      this.validators[name] = [];
      Object.defineProperty(this, name, {
        get: () => {
          if (options.get) {
            options.get.call(this);
          } else {
            return this.attributes[name];
          }
        },
        set: (value) => {
          if (options.set) {
            options.set.call(this, value);
          } else {
            this.attributes[name] = value;
          }
          this.validate();
        }
      })
    }

    get valid() {
      return this.errors.any();
    }

    public validate() {
      this.errors = new ErrorHandler();
      _.each(this.validators, (validators, attribute) => {
        _.each(validators, (validator) => {
          validator.validate(this, attribute, this[attribute]);
        });
      });
    }
    
    protected validates(attribute: string, V, options: any = {}) {
      this.validators[attribute].push(new V(options));
    }
  }
}

window.Dougal = Dougal;
