/// <reference types="jasmine" />
/// <reference path="../lib/decorators/attribute.ts" />
/// <reference path="../lib/model.ts" />
/// <reference path="../lib/store.ts" />
/// <reference path="../lib/validator.ts" />

import Attribute = Dougal.Attribute;
import Model = Dougal.Model;
import Store = Dougal.Store;
import Validator = Dougal.Validator;

class BirthDateValidator extends Validator {
  validate(president, attribute, value) {
    if (value < new Date()) {
      president.errors.add(attribute, this.options.message);
    }
  }
}

class LocalStore implements Store {
  static items = [];

  list() {
    return Q.when(LocalStore.items);
  }

  create(record): Q.Promise<any> {
    record.id = _.uniqueId();
    let object = record.serializer.format();
    LocalStore.items.push(object);
    return this.read(record);
  }

  read(record: Model): Q.Promise<any> {
    return Q.when(_.find(LocalStore.items, [record.idAttribute, record.id]));
  }

  update(record): Q.Promise<any> {
    let object = record.serializer.format();
    let index = _.findIndex(LocalStore.items, [record.idAttribute, record.id]);
    LocalStore.items.splice(index, 1, object);
    return Q.when(object);
  }

  delete(record): Q.Promise<any> {
    _.remove(LocalStore.items, [record.idAttribute, record.id]);
    return Q.when({});
  }
}

class President extends Model {
  // JS generator provides this static function
  static all(): Q.Promise<President[]> {
    return Model.all(President) as Q.Promise<President[]>;
  }

  store = new LocalStore();
  urlRoot = '/presidents';

  @Attribute
  id: number;

  @Attribute
  name: string;

  @Attribute
  birthdate: Date;

  constructor(attributes?: any) {
    super(attributes);

    this.validates('name', {
      presence: true,
      length: {minimum: 2},
      message: 'Name is required'
    });
    this.validates('name', 'validatePresidentName');

    this.validates('birthdate', new BirthDateValidator({message: 'No babies allowed'}));
  }

  isPresident() {
    return _.lowerCase(this.name) === 'donald';
  }

  validatePresidentName() {
    if (!this.isPresident()) {
      this.errors.add('name', 'Donald is the president!');
    }
  }
}
