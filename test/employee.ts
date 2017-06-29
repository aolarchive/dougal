namespace Dougal.Tests {
  @ExtendedModel
  export class Employee extends Model {
    store = new LocalStore();
    urlRoot = '/employees';

    id: number;
    name: string;
    birthdate: Date;

    constructor(attributes?: any) {
      super(attributes);

      this.attribute('id', 'Number');
      this.attribute('name');
      this.attribute('birthdate', 'Date');

      this.validates('name', {
        presence: true,
        length: {minimum: 2},
        message: 'Name is required'
      });
      this.validates('name', 'isNameValid', 'Some names are forbidden');
    }

    isNameValid() {
      return this.name !== 'forbidden name';
    }
  }

}
