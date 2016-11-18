/// <reference types="jasmine" />
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

  create(record): Q.Promise<any> {
    record.id = _.uniqueId();
    let id = _.uniqueId();
    let object = record.serializer.format();
    localStorage.setItem(record.url(), JSON.stringify(object));
    return this.read(record);
  }

  read(record): Q.Promise<any> {
    return Q.when(JSON.parse(localStorage.getItem(record.url())));
  }

  update(record): Q.Promise<any> {
    let object = record.serializer.format();
    localStorage.setItem(record.url(), JSON.stringify(object));
    return Q.when(object);
  }

  delete(record): Q.Promise<any> {
    _.set(localStorage, record.url(), '');
    return Q.when({});
  }
}

class President extends Model {
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
