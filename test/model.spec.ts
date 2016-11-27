namespace Dougal.Tests {
  describe('Dougal.Model', () => {
    beforeAll(() => {
      LocalStore.items = [{
        id: 1,
        name: 'John'
      }];
    });

    describe('static methods', () => {
      describe('all', () => {
        it('should get all models', (done) => {
          Employee.all()
            .then((Employees) => {
              expect(Employees.length).toBe(1);
              expect(Employees[0] instanceof Employee).toBe(true);
            })
            .finally(done);
        });
      });

      describe('extends', () => {
        // TODO
      });

      describe('find', () => {
        it('should find a model by ID', (done) => {
          Employee.find(1)
            .then((employee) => {
              expect(employee instanceof Employee).toBe(true);
              expect(employee.id).toBe(1);
              expect(employee.name).toBe('John');
              expect(employee.changed).toEqual({});
            })
            .finally(done);
        });

        it('should throw an error if the record is not found', (done) => {
          Employee.find(999)
            .then(() => {
              fail('it should reject the promise');
            })
            .catch((error) => {
              expect(error).toEqual(new Error('Record Not Found'));
            })
            .finally(done);
        });
      });
    });

    describe('methods', () => {
      let employee: Employee;
      beforeEach(() => {
        employee = new Employee();
      });

      describe('save', () => {
        xit('should reject if validations fail', (done) => {
          employee.save()
            .catch((errors) => {
              expect(errors.name).toEqual(['something']);
            })
            .finally(done);
        }).pend('need Q/angular.$q abstraction');

        it('should allow to skip validation', () => {
          spyOn(employee.store, 'create').and.returnValue(Q.when());
          spyOn(employee, 'validate');
          employee.save({validate: false});
          expect(employee.store.create).toHaveBeenCalled();
          expect(employee.validate).not.toHaveBeenCalled();
        });
      });
    });
  });
}
