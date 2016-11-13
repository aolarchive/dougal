namespace Dougal {
  const ResolverErrors = {
    INVALID_FORMAT: 'unrecognized validation format'
  };

  export class ValidatorResolver {
    static namedValidators: {[key: string]: Function} = {};

    attribute: string;
    validator: Validator;

    constructor(args: IArguments) {
      switch (args.length) {
      case 2:
        this.resolveAttributeValidator(args);
        break;
      default:
        throw ResolverErrors.INVALID_FORMAT;
      }
    }

    private resolveAttributeValidator(args: IArguments) {
      if (!_.isString(args[0])) {
        throw ResolverErrors.INVALID_FORMAT;
      }
      this.attribute = <string> args[0];
      this.resolveValidator(args[1]);
    }

    private resolveValidator(validator: any) {
      if (validator instanceof Validator) {
        this.validator = validator;
      } else if (_.isString(validator)) {
        this.resolveString(validator);
      } else if (_.isObject(validator)) {
        this.resolveObject(validator);
      } else {
        throw ResolverErrors.INVALID_FORMAT;
      }
    }

    private resolveString(method: string) {
      let Anon = Validator.simple(function (record, attribute, value) {
        _.get(record, method, _.noop).call(record, attribute, value);
      });
      this.validator = new Anon();
    }

    private resolveObject(options: any) {
      let availableValidators = _.keys(ValidatorResolver.namedValidators);
      let keys = _(options)
        .keys()
        .intersection(availableValidators)
        .value();
      let validators = _.map(keys, (key) => {
        return new ValidatorResolver.namedValidators[key](options);
      });
      let Anon = Validator.simple(() => {
        let args = arguments;
        _.each(validators, (validator) => {
          validator.validate.apply(validator, args);
        });
      });
      this.validator = new Anon(options);
    }

    run(record) {
      if (this.attribute) {
        this.validator.validate(record, this.attribute, _.get(record, this.attribute));
      }
    }
  }
}