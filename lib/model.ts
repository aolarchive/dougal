namespace Dougal {

  interface ISaveOptions {
    validate?: boolean
  }

  interface ISetOptions {
    silent?: boolean
  }

  export abstract class Model {
    static extends(constructor: Function) {
      let ExtendedModel: any = function ExtendedModel() {
        Model.apply(this, arguments);
        constructor.apply(this, arguments);
      }

      ExtendedModel.prototype = Object.create(Model.prototype, {
        constructor: ExtendedModel
      });

      Object.defineProperty(ExtendedModel.prototype, 'id',
        Object.getOwnPropertyDescriptor(Model.prototype, 'id'));

      ExtendedModel.all = function () {
        return Model.all(ExtendedModel);
      };

      ExtendedModel.delete = function (criteria) {
        return Model.delete(criteria, ExtendedModel);
      };

      ExtendedModel.find = function (criteria) {
        return Model.find(criteria, ExtendedModel);
      };

      return ExtendedModel;
    }

    protected static all(ExtendedModel): Q.Promise<Model[]> {
      let model: Model = new ExtendedModel();
      return model.store.list(model.urlRoot)
        .then((response) => {
          return _.map(response, (data) => {
            return new ExtendedModel().parse(data);
          });
        });
    }

    protected static delete(criteria: any, ExtendedModel) {
      let model: Model = new ExtendedModel();
      if (_.isObject(criteria)) {
        model.set(criteria);
      } else {
        model.set(model.idAttribute, criteria);
      }
      return model.delete();
    }

    protected static find(criteria: any, ExtendedModel): Q.Promise<Model> {
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
      var data = _.clone(response);
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
      var json = _.clone(this.attributes);
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
