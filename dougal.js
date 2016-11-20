(function (Dougal) { 'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dougal;
(function (Dougal) {
    Dougal.defaultStore = undefined;
    Dougal.Q = window['Q'];
    Dougal.URL_INTERPOLATION = /:(\w+)/g;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    function Attribute(prototype, attribute, options) {
        Object.defineProperty(prototype, attribute, {
            get: function () {
                return this.get(attribute);
            },
            set: function (value) {
                this.set(attribute, value);
            }
        });
    }
    Dougal.Attribute = Attribute;
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
    var Model = (function () {
        function Model(attributes) {
            this.attributes = {};
            this.changed = {};
            this.errors = new Dougal.Validations.ErrorHandler(this);
            this.idAttribute = 'id';
            this.serializer = new Dougal.Serializer(this);
            this.store = Dougal.defaultStore;
            this.validators = [];
            this.set(attributes, { silent: true });
        }
        Model.all = function (ExtendedModel) {
            var model = new ExtendedModel();
            return model.store.list(model.urlRoot)
                .then(function (models) {
                return _.map(models, function (model) {
                    return new ExtendedModel(model);
                });
            });
        };
        Model.extends = function (constructor) {
            var ExtendedModel = function ExtendedModel() {
                Model.apply(this, arguments);
                constructor.apply(this, arguments);
            };
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
        };
        Model.find = function (id, ExtendedModel) {
            var model = new ExtendedModel();
            model.set(model.idAttribute, id, { silent: true });
            return model.store.read(model)
                .then(function (data) {
                if (data) {
                    model.set(data, { silent: true });
                    return model;
                }
                throw new Error('Record Not Found');
            });
        };
        Model.prototype.attribute = function (name) {
            Dougal.Attribute(this, name);
        };
        Model.prototype.get = function (key) {
            return _.get(this.attributes, key);
        };
        Model.prototype.has = function (key) {
            return _.has(this.attributes, key);
        };
        Object.defineProperty(Model.prototype, "id", {
            get: function () {
                return this.attribute[this.idAttribute];
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
        Model.prototype.save = function () {
            var _this = this;
            this.validate();
            if (this.errors.any()) {
                return Dougal.Q.reject(this.errors);
            }
            return (this.isNew() ? this.store.create(this) : this.store.update(this))
                .then(function (response) {
                _this.set(_this.serializer.parse(response));
                _this.changed = {};
                return response;
            });
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
            if (!options.silent) {
                this.validate();
            }
        };
        Model.prototype.url = function () {
            var baseUrl = _.template(this.urlRoot, {
                interpolate: Dougal.URL_INTERPOLATION
            })(this.attributes);
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
                resolver.run(_this);
            });
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
    var Serializer = (function () {
        function Serializer(record) {
            this.record = record;
        }
        Serializer.prototype.format = function () {
            return _.cloneDeep(this.record.attributes);
        };
        Serializer.prototype.parse = function (object) {
            return object;
        };
        Serializer = __decorate([
            Dougal.Extendable
        ], Serializer);
        return Serializer;
    }());
    Dougal.Serializer = Serializer;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var Validator = (function () {
        function Validator(options) {
            if (options === void 0) { options = {}; }
            this.options = options;
        }
        Validator.simple = function (validate) {
            return (function (_super) {
                __extends(AnonymousValidator, _super);
                function AnonymousValidator() {
                    _super.apply(this, arguments);
                }
                AnonymousValidator.prototype.validate = function () {
                    return validate.apply(this, arguments);
                };
                return AnonymousValidator;
            }(Validator));
        };
        Validator = __decorate([
            Dougal.Extendable
        ], Validator);
        return Validator;
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
                switch (args.length) {
                    case 2:
                        this.resolveAttributeValidator(args);
                        break;
                    default:
                        throw ResolverErrors.INVALID_FORMAT;
                }
            }
            ValidatorResolver.prototype.resolveAttributeValidator = function (args) {
                if (!_.isString(args[0])) {
                    throw ResolverErrors.INVALID_FORMAT;
                }
                this.attribute = args[0];
                this.resolveValidator(args[1]);
            };
            ValidatorResolver.prototype.resolveValidator = function (validator) {
                if (validator instanceof Dougal.Validator) {
                    this.validator = validator;
                }
                else if (_.isString(validator)) {
                    this.resolveString(validator);
                }
                else if (_.isObject(validator)) {
                    this.resolveObject(validator);
                }
                else {
                    throw ResolverErrors.INVALID_FORMAT;
                }
            };
            ValidatorResolver.prototype.resolveString = function (method) {
                var Anon = Dougal.Validator.simple(function (record, attribute, value) {
                    _.get(record, method, _.noop).call(record, attribute, value);
                });
                this.validator = new Anon();
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
                    _.each(validators, function (validator) {
                        validator.validate.apply(validator, args);
                    });
                });
                this.validator = new Anon(options);
            };
            ValidatorResolver.prototype.run = function (record) {
                if (this.attribute) {
                    this.validator.validate(record, this.attribute, record.get(this.attribute));
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
                _super.call(this, options);
            }
            LengthValidator.prototype.validate = function (record, attribute, value) {
                var _this = this;
                var length = _.size(value);
                var lengthOptions = this.options.length;
                var results = {
                    is: length !== lengthOptions.is,
                    minimum: length < lengthOptions.minimum,
                    maximum: length > lengthOptions.maximum
                };
                _.each(results, function (valid, test) {
                    if (lengthOptions[test] && valid) {
                        record.errors.add(attribute, _this.options.message);
                    }
                });
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
        var PresenceValidator = (function (_super) {
            __extends(PresenceValidator, _super);
            function PresenceValidator() {
                _super.apply(this, arguments);
            }
            PresenceValidator.prototype.validate = function (record, attribute, value) {
                if (this.options.presence && (_.isNil(value) || value === '')) {
                    record.errors.add(attribute, this.options.message);
                }
            };
            return PresenceValidator;
        }(Dougal.Validator));
        Validations.PresenceValidator = PresenceValidator;
    })(Validations = Dougal.Validations || (Dougal.Validations = {}));
})(Dougal || (Dougal = {}));

})(window.Dougal = {});