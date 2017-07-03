namespace Dougal {

  interface ISaveOptions {
    validate?: boolean
  }

  interface ISetOptions {
    silent?: boolean
  }

  export abstract class Model {
    static extends(constructor: Function) {
      let NewModel: any = function NewModel() {
        Model.apply(this, arguments);
        constructor.apply(this, arguments);
      };

      NewModel.prototype = Object.create(Model.prototype, {
        constructor: NewModel
      });

      return ExtendedModel(NewModel);
    }

    public static all(): Q.Promise<Model[]> {
      // Empty function, left for TypeScript typing
      throw new Error('Not yet implemented, use Model.extends instead');
    }
    protected static _all(ExtendedModel): Q.Promise<Model[]> {
      return Model._where({}, ExtendedModel);
    }

    public static delete(criteria: any): Q.Promise<any> {
      // Empty function, left for TypeScript typing
      throw new Error('Not yet implemented, use Model.extends instead');
    }
    protected static _delete(criteria: any, ExtendedModel): Q.Promise<any> {
      let model: Model = new ExtendedModel();
      if (_.isObject(criteria)) {
        model.set(criteria);
      } else {
        model.set(model.idAttribute, criteria);
      }
      return model.delete();
    }

    public static find(criteria: any): Q.Promise<Model> {
      // Empty function, left for TypeScript typing
      throw new Error('Not yet implemented, use Model.extends instead');
    }
    protected static _find(criteria: any, ExtendedModel): Q.Promise<Model> {
      let model: Model = new ExtendedModel();
      if (_.isObject(criteria)) {
        model.set(criteria, {silent: true});
      } else {
        model.set(model.idAttribute, criteria, {silent: true});
      }
      return model.store.read(model)
        .then((data) => {
          if (data) {
            model.parse(data);
            return model;
          }
          return q.reject('Record Not Found');
        });
    }

    public static where(criteria: any): Q.Promise<Model[]> {
      // Empty function, left for TypeScript typing
      throw new Error('Not yet implemented, use Model.extends instead');
    }
    public static _where(criteria: any, ExtendedModel): Q.Promise<Model[]> {
      let model = new ExtendedModel();
      // TODO parameters in urlRoot
      return model.store.list(model.urlRoot, criteria)
        .then((response) => {
          return _.map(response, (data) => {
            return new ExtendedModel().parse(data);
          });
        });
    };

    attributes: any = {};
    changed: any = {};
    errors: Validations.ErrorHandler = new Validations.ErrorHandler(this);
    idAttribute: string = 'id';
    serializers = {};
    store: Store = Config.defaultStore;
    urlRoot: string;
    validators: Validations.ValidatorResolver[] = [];

    constructor(attributes?: Object) {
      this.set(attributes, {silent: true});
    }

    attribute(name: string, type?: string): void {
      if (name !== 'id') {
        Object.defineProperty(this, name, {
          get: function () {
            return this.get(name);
          },
          set: function (value) {
            this.set(name, value);
          }
        });
      }

      this.serializes(name, type);
    }

    delete(): Q.Promise<any> {
      return this.store.delete(this);
    }

    get(key: string): any {
      return _.get(this.attributes, key);
    }

    has(key: string): boolean {
      return _.has(this.attributes, key);
    }

    get id() {
      return this.attributes[this.idAttribute];
    }

    set id(value) {
      this.attributes[this.idAttribute] = value;
    }

    isNew(): boolean {
      return !this.has(this.idAttribute);
    }

    isValid(): boolean {
      return !this.errors.any();
    }

    parse(response: Object): Model {
      let data = _.clone(response);
      _.forEach(this.serializers, (serializer: Serialization.ISerializer, key: string) => {
        _.set(data, key, serializer.parse(_.get(data, key)));
      });
      this.set(data, {silent: true});
      return this;
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
          this.parse(response);
          this.changed = {};
          return response;
        });
    }

    serializes(key: string, serializer: Serializer) {
      this.serializers[key] = Serialization.resolve(serializer);
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
      this.validate();
    }

    toJson(): Object {
      let json = _.clone(this.attributes);
      _.forEach(this.serializers, (serializer: Serialization.ISerializer, key: string) => {
        _.set(json, key, serializer.format(_.get(json, key)));
      });
      return json;
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

    validate(): boolean {
      this.errors = new Validations.ErrorHandler(this);
      _.each(this.validators, (resolver: Validations.ValidatorResolver) => {
        if (!resolver.run(this)) {
          this.errors.add(resolver.attribute, resolver.validator.message);
        }
      });
      return this.isValid();
    }

    validates(attribute: string, method: string, message: string): void;
    validates(attribute: string, validator: Validator): void;
    validates(attribute: string, options: IValidatorOptions): void;
    validates(): void {
      this.validators.push(new Validations.ValidatorResolver(arguments));
      this.validate();
    }
  }
}
