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
              expect(error).toEqual('Record Not Found');
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
        it('should reject if validations fail', (done) => {
          employee.save()
            .catch((errors) => {
              expect(errors.name).toEqual(['Name is required']);
            })
            .finally(done);
        });

        it('should allow to skip validation', () => {
          spyOn(employee.store, 'create').and.returnValue(q.when());
          spyOn(employee, 'validate');
          employee.save({validate: false});
          expect(employee.store.create).toHaveBeenCalled();
          expect(employee.validate).not.toHaveBeenCalled();
        });
      });

      describe('validate', () => {
        it('should mark a model as valid only if all validations pass', () => {
          employee.name = 'John Doe';
          expect(employee.isValid()).toBe(true);
          expect(employee.errors.any()).toBe(false);
          expect(employee.errors.name).toEqual([]);

          employee.name = '';
          expect(employee.isValid()).toBe(false);
          expect(employee.errors.any()).toBe(true);
          expect(employee.errors.name).toEqual(['Name is required']);
        });
      })
    });
  });
}
