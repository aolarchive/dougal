namespace Dougal.Tests {
  export class Employee extends Model {
    // JS generator provides these static functions
    static all(): Q.Promise<Employee[]> {
      return Model.all(Employee) as Q.Promise<Employee[]>;
    }

    static delete(criteria: any): Q.Promise<any> {
      return Model.delete(criteria, Employee) as Q.Promise<any>;
    }

    static find(id: any): Q.Promise<Employee> {
      return Model.find(id, Employee) as Q.Promise<Employee>;
    }

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
