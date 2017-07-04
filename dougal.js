(function (Dougal) { 'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Dougal;
(function (Dougal) {
    Dougal.Version = '0.2.0';
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Config;
    (function (Config) {
        Config.defaultStore = undefined;
        Config.urlInterpolation = /:(\w+)/g;
    })(Config = Dougal.Config || (Dougal.Config = {}));
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Q = window['Q'];
    var q;
    (function (q) {
        function reject(error) {
            var deferred = Q.defer();
            deferred.reject(error);
            return deferred.promise;
        }
        q.reject = reject;
        ;
        function when(value) {
            var deferred = Q.defer();
            deferred.resolve(value);
            return deferred.promise;
        }
        q.when = when;
        ;
    })(q = Dougal.q || (Dougal.q = {}));
    ;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    function Extendable(BaseClass) {
        BaseClass.extends = function (constructor) {
            function Extended() {
                BaseClass.apply(this, arguments);
                constructor.apply(this, arguments);
            }
            Extended.prototype = Object.create(BaseClass.prototype, {
                constructor: Extended
            });
            return Extended;
        };
    }
    Dougal.Extendable = Extendable;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    function ExtendedModel(NewModel) {
        NewModel.all = function () {
            return Dougal.Model._all(NewModel);
        };
        NewModel.delete = function (criteria) {
            return Dougal.Model._delete(criteria, NewModel);
        };
        NewModel.find = function (id) {
            return Dougal.Model._find(id, NewModel);
        };
        NewModel.where = function (criteria) {
            return Dougal.Model._where(criteria, NewModel);
        };
        Object.defineProperty(NewModel.prototype, 'id', Object.getOwnPropertyDescriptor(Dougal.Model.prototype, 'id'));
        return NewModel;
    }
    Dougal.ExtendedModel = ExtendedModel;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Model = (function () {
        function Model(attributes) {
            this.attributes = {};
            this.changed = {};
            this.errors = new Dougal.Validations.ErrorHandler(this);
            this.idAttribute = 'id';
            this.serializers = {};
            this.store = Dougal.Config.defaultStore;
            this.validators = [];
            this.set(attributes, { silent: true });
        }
        Model.extends = function (constructor) {
            var NewModel = function NewModel() {
                Model.apply(this, arguments);
                constructor.apply(this, arguments);
            };
            NewModel.prototype = Object.create(Model.prototype, {
                constructor: NewModel
            });
            return Dougal.ExtendedModel(NewModel);
        };
        Model.all = function () {
            throw new Error('Not yet implemented, use Model.extends instead');
        };
        Model._all = function (ExtendedModel) {
            return Model._where({}, ExtendedModel);
        };
        Model.delete = function (criteria) {
            throw new Error('Not yet implemented, use Model.extends instead');
        };
        Model._delete = function (criteria, ExtendedModel) {
            var model = new ExtendedModel();
            if (_.isObject(criteria)) {
                model.set(criteria);
            }
            else {
                model.set(model.idAttribute, criteria);
            }
            return model.delete();
        };
        Model.find = function (criteria) {
            throw new Error('Not yet implemented, use Model.extends instead');
        };
        Model._find = function (criteria, ExtendedModel) {
            var model = new ExtendedModel();
            if (_.isObject(criteria)) {
                model.set(criteria, { silent: true });
            }
            else {
                model.set(model.idAttribute, criteria, { silent: true });
            }
            return model.fetch();
        };
        Model.interpolate = function (url, attributes) {
            if (attributes === void 0) { attributes = {}; }
            return _.template(url, {
                interpolate: Dougal.Config.urlInterpolation
            })(attributes);
        };
        Model.where = function (criteria) {
            throw new Error('Not yet implemented, use Model.extends instead');
        };
        Model._where = function (criteria, ExtendedModel) {
            var model = new ExtendedModel();
            return model.store.list(Model.interpolate(model.urlRoot, criteria), criteria)
                .then(function (response) {
                return _.map(response, function (data) {
                    return new ExtendedModel().parse(data);
                });
            });
        };
        ;
        Model.prototype.attribute = function (name, type) {
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
        };
        Model.prototype.delete = function () {
            return this.store.delete(this);
        };
        Model.prototype.fetch = function () {
            var _this = this;
            return this.store.read(this)
                .then(function (data) {
                if (data) {
                    return _this.parse(data);
                }
                return Dougal.q.reject('Record Not Found');
            });
        };
        Model.prototype.get = function (key) {
            return _.get(this.attributes, key);
        };
        Model.prototype.has = function (key) {
            return _.has(this.attributes, key);
        };
        Object.defineProperty(Model.prototype, "id", {
            get: function () {
                return this.attributes[this.idAttribute];
            },
            set: function (value) {
                this.attributes[this.idAttribute] = value;
            },
            enumerable: true,
            configurable: true
        });
        Model.prototype.isNew = function () {
            return !this.has(this.idAttribute);
        };
        Model.prototype.isValid = function () {
            return !this.errors.any();
        };
        Model.prototype.parse = function (response) {
            var data = _.clone(response);
            _.forEach(this.serializers, function (serializer, key) {
                _.set(data, key, serializer.parse(_.get(data, key)));
            });
            this.set(data, { silent: true });
            return this;
        };
        Model.prototype.save = function (options) {
            var _this = this;
            options = _.defaults(options, {
                validate: true
            });
            if (options.validate) {
                this.validate();
                if (this.errors.any()) {
                    return Dougal.q.reject(this.errors);
                }
            }
            return (this.isNew() ? this.store.create(this) : this.store.update(this))
                .then(function (response) {
                _this.parse(response);
                _this.changed = {};
                return response;
            });
        };
        Model.prototype.serializes = function (key, serializer) {
            this.serializers[key] = Dougal.Serialization.resolve(serializer);
        };
        Model.prototype.set = function () {
            var _this = this;
            var changes = {};
            var options;
            if (_.isString(arguments[0])) {
                changes[arguments[0]] = arguments[1];
                options = arguments[2];
            }
            else {
                changes = arguments[0] || {};
                options = arguments[1];
            }
            options = _.defaults(options, {
                silent: false
            });
            _.each(changes, function (value, key) {
                _.set(_this.attributes, key, value);
                if (!options.silent) {
                    _.set(_this.changed, key, value);
                }
            });
            this.validate();
        };
        Model.prototype.toJson = function () {
            var json = _.clone(this.attributes);
            _.forEach(this.serializers, function (serializer, key) {
                _.set(json, key, serializer.format(_.get(json, key)));
            });
            return json;
        };
        Model.prototype.url = function () {
            var baseUrl = Model.interpolate(this.urlRoot, this.attributes);
            if (this.isNew()) {
                return baseUrl;
            }
            else {
                var id = this.get(this.idAttribute);
                return baseUrl.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
            }
        };
        Model.prototype.validate = function () {
            var _this = this;
            this.errors = new Dougal.Validations.ErrorHandler(this);
            _.each(this.validators, function (resolver) {
                if (!resolver.run(_this)) {
                    _this.errors.add(resolver.attribute, resolver.validator.message);
                }
            });
            return this.isValid();
        };
        Model.prototype.validates = function () {
            this.validators.push(new Dougal.Validations.ValidatorResolver(arguments));
            this.validate();
        };
        return Model;
    }());
    Dougal.Model = Model;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Serialization;
    (function (Serialization) {
        var availableSerializers = {};
        function get(name) {
            return availableSerializers[_.toLower(name)];
        }
        Serialization.get = get;
        function register(name, serializer) {
            availableSerializers[_.toLower(name)] = serializer;
        }
        Serialization.register = register;
        function resolve(serializer) {
            return (_.isString(serializer) ? get(serializer) : serializer)
                || {
                    format: _.identity,
                    parse: _.identity
                };
        }
        Serialization.resolve = resolve;
        var DateSerializer = {
            format: function (value) {
                return _.isDate(value)
                    ? value.toISOString()
                    : value;
            },
            parse: function (value) {
                return _.isNil(value) ? value : new Date(value);
            }
        };
        register('date', DateSerializer);
        var NumberSerializer = {
            format: _.identity,
            parse: function (value) {
                return parseFloat(value);
            }
        };
        register('number', NumberSerializer);
    })(Serialization = Dougal.Serialization || (Dougal.Serialization = {}));
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    Dougal.TEMP = 'FIXME';
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Validator = (function () {
        function Validator(options) {
            this.options = options;
        }
        Validator_1 = Validator;
        Validator.simple = function (validate) {
            return (function (_super) {
                __extends(AnonymousValidator, _super);
                function AnonymousValidator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AnonymousValidator.prototype.validate = function () {
                    return validate.apply(this, arguments);
                };
                return AnonymousValidator;
            }(Validator_1));
        };
        Object.defineProperty(Validator.prototype, "message", {
            get: function () {
                return this.options.message;
            },
            enumerable: true,
            configurable: true
        });
        Validator = Validator_1 = __decorate([
            Dougal.Extendable
        ], Validator);
        return Validator;
        var Validator_1;
    }());
    Dougal.Validator = Validator;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Validations;
    (function (Validations) {
        var ResolverErrors = {
            INVALID_FORMAT: 'unrecognized validation format'
        };
        var ValidatorResolver = (function () {
            function ValidatorResolver(args) {
                this.resolveAttributeValidator(args);
            }
            ValidatorResolver.prototype.resolveAttributeValidator = function (args) {
                if (!_.isString(args[0])) {
                    throw ResolverErrors.INVALID_FORMAT;
                }
                this.attribute = args[0];
                this.resolveValidator(args[1], args[2]);
            };
            ValidatorResolver.prototype.resolveValidator = function (validator, message) {
                if (validator instanceof Dougal.Validator) {
                    this.validator = validator;
                }
                else if (_.isString(validator)) {
                    this.resolveString(validator, message);
                }
                else if (_.isObject(validator)) {
                    this.resolveObject(validator);
                }
                else {
                    throw ResolverErrors.INVALID_FORMAT;
                }
            };
            ValidatorResolver.prototype.resolveString = function (method, message) {
                var Anon = Dougal.Validator.simple(function (record, attribute, value) {
                    return _.get(record, method, _.noop).call(record, attribute, value);
                });
                this.validator = new Anon({ message: message });
            };
            ValidatorResolver.prototype.resolveObject = function (options) {
                var validators = _(options)
                    .keys()
                    .map(function (key) {
                    return Dougal.Validations[_.capitalize(key) + 'Validator'];
                })
                    .without(undefined)
                    .map(function (Validator) {
                    return new Validator(options);
                })
                    .value();
                var Anon = Dougal.Validator.simple(function () {
                    var args = arguments;
                    return _.reduce(validators, function (anyError, validator) {
                        return anyError || !!validator.validate.apply(validator, args);
                    }, false);
                });
                this.validator = new Anon(options);
            };
            ValidatorResolver.prototype.run = function (record) {
                if (this.attribute) {
                    return this.validator.validate(record, this.attribute, record.get(this.attribute));
                }
                else {
                    return false;
                }
            };
            return ValidatorResolver;
        }());
        Validations.ValidatorResolver = ValidatorResolver;
    })(Validations = Dougal.Validations || (Dougal.Validations = {}));
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Validations;
    (function (Validations) {
        var ErrorHandler = (function () {
            function ErrorHandler(record) {
                var _this = this;
                this.messages = {};
                _(record.attributes)
                    .keys()
                    .each(function (key) {
                    _this.init(key);
                });
            }
            ErrorHandler.prototype.add = function (attribute, message) {
                if (_.isUndefined(this.messages[attribute])) {
                    this.init(attribute);
                }
                if (_.includes(this.messages[attribute], message)) {
                    return;
                }
                this.messages[attribute].push(message);
            };
            ErrorHandler.prototype.any = function () {
                return !_(this.messages)
                    .values()
                    .flatten()
                    .isEmpty();
            };
            ErrorHandler.prototype.init = function (attribute) {
                var _this = this;
                this.messages[attribute] = [];
                Object.defineProperty(this, attribute, {
                    get: function () {
                        return _this.messages[attribute];
                    }
                });
            };
            return ErrorHandler;
        }());
        Validations.ErrorHandler = ErrorHandler;
    })(Validations = Dougal.Validations || (Dougal.Validations = {}));
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Validations;
    (function (Validations) {
        var LengthValidator = (function (_super) {
            __extends(LengthValidator, _super);
            function LengthValidator(options) {
                return _super.call(this, options) || this;
            }
            LengthValidator.prototype.validate = function (record, attribute, value) {
                var length = _.size(value);
                var lengthOptions = this.options.length;
                var results = {
                    is: length === lengthOptions.is,
                    minimum: length >= lengthOptions.minimum,
                    maximum: length <= lengthOptions.maximum
                };
                return _(results)
                    .values()
                    .without(false)
                    .some();
            };
            return LengthValidator;
        }(Dougal.Validator));
        Validations.LengthValidator = LengthValidator;
    })(Validations = Dougal.Validations || (Dougal.Validations = {}));
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Validations;
    (function (Validations) {
        var NumberValidator = (function (_super) {
            __extends(NumberValidator, _super);
            function NumberValidator() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            NumberValidator.prototype.validate = function (record, attribute, value) {
                var parsedValue = parseFloat(value);
                var numberOptions = this.options.number;
                if (_.isNaN(parsedValue)) {
                    return false;
                }
                var results = {
                    greaterThan: value > numberOptions.greaterThan,
                    greaterThanOrEqualTo: value >= numberOptions.greaterThanOrEqualTo,
                    lessThan: value < numberOptions.lessThan,
                    lessThanOrEqualTo: value <= numberOptions.lessThanOrEqualTo
                };
                return _(results)
                    .values()
                    .without(false)
                    .some();
            };
            return NumberValidator;
        }(Dougal.Validator));
        Validations.NumberValidator = NumberValidator;
    })(Validations = Dougal.Validations || (Dougal.Validations = {}));
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Validations;
    (function (Validations) {
        var PresenceValidator = (function (_super) {
            __extends(PresenceValidator, _super);
            function PresenceValidator() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PresenceValidator.prototype.validate = function (record, attribute, value) {
                return !(this.options.presence && (_.isNil(value) || value === ''));
            };
            return PresenceValidator;
        }(Dougal.Validator));
        Validations.PresenceValidator = PresenceValidator;
    })(Validations = Dougal.Validations || (Dougal.Validations = {}));
})(Dougal || (Dougal = {}));

})(window.Dougal = {});