namespace Dougal {

  interface ISetOptions {
    silent?: boolean
  }

  @Extendable
  export abstract class Model {
    attributes: any = {};
    changed: any = {};
    errors: Validations.ErrorHandler = new Validations.ErrorHandler(this);
    idAttribute: string = 'id';
    serializer = new Serializer(this);
    store: Store = defaultStore;
    urlRoot: string;
    validators: Validations.ValidatorResolver[] = [];

    constructor(attributes?: Object) {
      this.set(attributes, {silent: true});
    }

    attribute(name: string): void {
      Attribute(this, name);
    }

    get(key: string): any {
      return _.get(this.attributes, key);
    }

    has(key: string): boolean {
      return _.has(this.attributes, key);
    }

    isNew(): boolean {
      return !this.has(this.idAttribute);
    }

    isValid(): boolean {
      return !this.errors.any();
    }

    save(): Q.Promise<any> {
      this.validate();
      if (this.errors.any()) {
        return Q.reject(this.errors);
      }
      return (this.isNew() ? this.store.create(this) : this.store.update(this))
        .then((response) => {
          this.set(this.serializer.parse(response));
          this.changed = {};
          return response;
        });
    }

    set(attributes: Object, options?: ISetOptions): void;
    set(key: string, value: any, options?: ISetOptions): void;
    set(): void {
      let changes = {};
      let options;
      if (_.isString(arguments[0])) {
        changes[arguments[0]] = arguments[1];
        options = arguments[2];
      } else {
        changes = arguments[0] || {};
        options = arguments[1];
      }
      
      options = _.defaults(options, {
        silent: false
      });
      _.each(changes, (value, key) => {
        _.set(this.attributes, key, value);
        if (!options.silent) {
          _.set(this.changed, key, value);
        }
      });
      if (!options.silent){
        this.validate();
      }
    }

    url(): string {
      let baseUrl = _.template(this.urlRoot, {
        interpolate: Dougal.URL_INTERPOLATION
      })(this.attributes);

      if (this.isNew()) {
        return baseUrl;
      } else {
        let id = this.get(this.idAttribute);
        return baseUrl.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
      }
    }

    validate(): void {
      this.errors = new Validations.ErrorHandler(this);
      _.each(this.validators, (resolver: Validations.ValidatorResolver) => {
        resolver.run(this);
      });
    }

    validates(attribute: string, method: string): void;
    validates(attribute: string, validator: Validator): void;
    validates(attribute: string, options: Object): void;
    validates(): void {
      this.validators.push(new Validations.ValidatorResolver(arguments));
      this.validate();
    }
  }
}
