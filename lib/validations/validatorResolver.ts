namespace Dougal.Validations {
  const ResolverErrors = {
    INVALID_FORMAT: 'unrecognized validation format'
  };

  export class ValidatorResolver {
    attribute: string;
    validator: Validator;

    constructor(args: IArguments) {
      this.resolveAttributeValidator(args);
    }

    private resolveAttributeValidator(args: IArguments) {
      if (!_.isString(args[0])) {
        throw ResolverErrors.INVALID_FORMAT;
      }
      this.attribute = <string> args[0];
      this.resolveValidator(args[1], args[2]);
    }

    private resolveValidator(validator: any, message?: string) {
      if (validator instanceof Validator) {
        this.validator = validator;
      } else if (_.isString(validator)) {
        this.resolveString(validator, message);
      } else if (_.isObject(validator)) {
        this.resolveObject(validator);
      } else {
        throw ResolverErrors.INVALID_FORMAT;
      }
    }

    private resolveString(method: string, message: string) {
      let Anon = Validator.simple(function (record, attribute, value) {
        return _.get(record, method, _.noop).call(record, attribute, value);
      });
      this.validator = new Anon({message: message});
    }

    private resolveObject(options: any) {
      let validators = _(options)
        .keys()
        .map((key) => {
          return Dougal.Validations[_.capitalize(key) + 'Validator'];
        })
        .without(undefined)
        .map((Validator) => {
          return new Validator(options);
        })
        .value();
      let Anon = Validator.simple(function () {
        let args = arguments;
        return _.reduce(validators, (anyError: boolean, validator) => {
          return anyError || !!validator.validate.apply(validator, args);
        }, false);
      });
      this.validator = new Anon(options);
    }

    run(record) {
      if (this.attribute) {
        return this.validator.validate(record, this.attribute, record.get(this.attribute));
      } else {
        // TODO
        return false;
      }
    }
  }
}