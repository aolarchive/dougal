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
        .then((response) => {
          return _.map(response, (data) => {
            return new ExtendedModel().parse(data);
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
      Object.defineProperty(this, name, {
        get: function () {
          return this.get(name);
        },
        set: function (value) {
          this.set(name, value);
        }
      });

      this.serializes(name, type);
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
      if (!options.silent){
        this.validate();
      }
    }

    toJson(): Object {
      var json = _.cloneDeep(this.attributes);
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
