namespace Dougal {

  @Extendable
  export abstract class Model {

    attributes: any = {};
    changed: any = {};
    errors: Validations.ErrorHandler;
    serializer = new Serializer(this);
    store: Store;
    urlRoot: string;
    validators: Validations.ValidatorResolver[] = [];

    attribute(name: string) {
      Attribute(this, name);
    }

    get(key): any {
      return _.get(this.attributes, key);
    }

    save(): Q.Promise<Model|Validations.ErrorHandler> {
      this.validate();
      if (this.errors.any()) {
        return Q.reject(this.errors);
      }
      return this.store.create(this)
        .then((response) => {
          _.assign(this.attributes, this.serializer.parse(response));
          return this;
        });
    }

    set(key, value) {
      _.set(this.attributes, key, value);
      _.set(this.changed, key, value);
      this.validate();
    }

    url() {
      return new URITemplate(this.urlRoot).expand(this);
    }

    get valid() {
      if (!this.errors) {
        this.errors = new Validations.ErrorHandler(this);
        this.validate();
      }
      return !this.errors.any();
    }

    validate() {
      this.errors = new Validations.ErrorHandler(this);
      _.each(this.validators, (resolver: Validations.ValidatorResolver) => {
        resolver.run(this);
      });
    }

    validates(...args: any[]) {
      this.validators.push(new Validations.ValidatorResolver(arguments));
    }
  }
}
