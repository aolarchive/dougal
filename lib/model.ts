namespace Dougal {

  interface ISaveOptions {
    validate?: boolean
  }

  interface ISetOptions {
    silent?: boolean
  }

  export abstract class Model {
    protected static all(ExtendedModel): Q.Promise<Model[]> {
      let model: Model = new ExtendedModel();
      return model.store.list(model.urlRoot)
        .then((models) => {
          return _.map(models, (model) => {
            return new ExtendedModel(model);
          });
        });
    }

    static extends(constructor: Function) {
      let ExtendedModel: any = function ExtendedModel() {
        Model.apply(this, arguments);
        constructor.apply(this, arguments);
      }

      ExtendedModel.prototype = Object.create(Model.prototype, {
        constructor: ExtendedModel
      });

      ExtendedModel.all = function () {
        return Model.all(ExtendedModel);
      };

      ExtendedModel.find = function (id) {
        return Model.find(id, ExtendedModel);
      };

      return ExtendedModel;
    }

    protected static find(id: any, ExtendedModel): Q.Promise<Model> {
      let model: Model = new ExtendedModel();
      model.set(model.idAttribute, id, {silent: true});
      return model.store.read(model)
        .then((data) => {
          if (data) {
            model.set(data, {silent: true});
            return model;
          }
          return q.reject('Record Not Found');
        });
    }

    attributes: any = {};
    changed: any = {};
    errors: Validations.ErrorHandler = new Validations.ErrorHandler(this);
    idAttribute: string = 'id';
    serializer = new Serializer(this);
    store: Store = Config.defaultStore;
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

    get id() {
      return this.attribute[this.idAttribute];
    }

    isNew(): boolean {
      return !this.has(this.idAttribute);
    }

    isValid(): boolean {
      return !this.errors.any();
    }

    save(options?: ISaveOptions): Q.Promise<any> {
      options = _.defaults(options, {
        validate: true
      });
      if (options.validate) {
        this.validate();
        if (this.errors.any()) {
          return q.reject(this.errors);
        }
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
        interpolate: Dougal.Config.urlInterpolation
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
    validates(attribute: string, options: IValidatorOptions): void;
    validates(): void {
      this.validators.push(new Validations.ValidatorResolver(arguments));
      this.validate();
    }
  }
}
