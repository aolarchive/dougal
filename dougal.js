var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dougal;
(function (Dougal) {
    var AttributeValidator = (function () {
        function AttributeValidator(options) {
            this.options = options || {};
        }
        AttributeValidator.extends = function (validateFn) {
            return (function (_super) {
                __extends(ExtendedAttributeValidator, _super);
                function ExtendedAttributeValidator() {
                    _super.apply(this, arguments);
                }
                ExtendedAttributeValidator.prototype.validate = function (record, attribute, value) {
                    return validateFn.apply(this, arguments);
                };
                return ExtendedAttributeValidator;
            }(AttributeValidator));
        };
        AttributeValidator.prototype.validate = function (record, attribute, value) { };
        return AttributeValidator;
    }());
    Dougal.AttributeValidator = AttributeValidator;
})(Dougal || (Dougal = {}));
var Dougal;
(function (Dougal) {
    var ErrorHandler = (function () {
        function ErrorHandler() {
            this.errorMessages = {};
        }
        ErrorHandler.prototype.add = function (attribute, message) {
            var _this = this;
            if (_.isUndefined(this.errorMessages[attribute])) {
                this.errorMessages[attribute] = [];
                Object.defineProperty(this, attribute, {
                    get: function () {
                        return _this.errorMessages[attribute];
                    }
                });
            }
            this.errorMessages[attribute].push(message);
        };
        ErrorHandler.prototype.any = function () {
            return _(this.errorMessages)
                .values()
                .flatten()
                .isEmpty();
        };
        return ErrorHandler;
    }());
    Dougal.ErrorHandler = ErrorHandler;
})(Dougal || (Dougal = {}));
function extendable(BaseClass) {
    BaseClass.extends = function (constructor, prototype) {
        function Extended() {
            BaseClass.apply(this);
            constructor.apply(this);
        }
        Extended.prototype = Object.create(BaseClass.prototype, {
            constructor: Extended
        });
        _.assign(Extended.prototype, prototype);
        return Extended;
    };
}
///<reference path="../node_modules/@types/lodash/index.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Dougal;
(function (Dougal) {
    Dougal.BasicValidators = {
        presence: function (value) {
            return _.isEmpty(value);
        }
    };
    var Model = (function () {
        function Model() {
            this.attributes = {};
            this.errors = new Dougal.ErrorHandler();
            this.validators = {};
        }
        Model.prototype.attribute = function (name, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            this.validators[name] = [];
            Object.defineProperty(this, name, {
                get: function () {
                    if (options.get) {
                        options.get.call(_this);
                    }
                    else {
                        return _this.attributes[name];
                    }
                },
                set: function (value) {
                    if (options.set) {
                        options.set.call(_this, value);
                    }
                    else {
                        _this.attributes[name] = value;
                    }
                    _this.validate();
                }
            });
        };
        Object.defineProperty(Model.prototype, "valid", {
            get: function () {
                return this.errors.any();
            },
            enumerable: true,
            configurable: true
        });
        Model.prototype.validate = function () {
            var _this = this;
            this.errors = new Dougal.ErrorHandler();
            _.each(this.validators, function (validators, attribute) {
                _.each(validators, function (validator) {
                    validator.validate(_this, attribute, _this[attribute]);
                });
            });
        };
        Model.prototype.validates = function (attribute, V, options) {
            if (options === void 0) { options = {}; }
            this.validators[attribute].push(new V(options));
        };
        Model = __decorate([
            extendable
        ], Model);
        return Model;
    }());
    Dougal.Model = Model;
})(Dougal || (Dougal = {}));
window.Dougal = Dougal;
