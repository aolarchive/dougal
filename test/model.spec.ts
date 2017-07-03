namespace Dougal.Tests {
  describe('Dougal.Model', () => {
    beforeEach(() => {
      LocalStore.items = [{
        id: _.uniqueId(),
        name: 'John'
      }];
    });

    describe('extends', () => {
      it('should create a Model subclass', () => {
        let Employee = Model.extends(function () {
          this.thing = 'something';
        });
        expect(Employee).toBeDefined();
        _.each(['all', 'delete', 'find'], (method) => {
          expect(Employee[method]).toBeDefined();
        });

        let employee = new Employee();
        expect(employee).toBeDefined();
        expect(employee instanceof Model).toBe(true);
        expect(employee instanceof Employee).toBe(true);
        expect(employee.thing).toEqual('something');
      });
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

      describe('delete', () => {
        it('should delete a model by ID', function (done) {
          let employee = _.head(LocalStore.items);
          Employee.delete(employee.id)
            .then(() => {
              expect(_.includes(LocalStore.items, employee)).toBe(false);
            })
            .catch(() => done.fail('deletion failed'))
            .finally(done);
        });

        it('should delete a model by attributes', function (done) {
          let employee = _.head(LocalStore.items);
          Employee.delete({id: employee.id})
            .then(() => {
              expect(_.includes(LocalStore.items, employee)).toBe(false);
            })
            .catch(() => done.fail('deletion failed'))
            .finally(done);
        });
      });

      describe('find', () => {
        it('should find a model by ID', (done) => {
          Employee.find(_.head(LocalStore.items).id)
            .then((employee) => {
              expect(employee instanceof Employee).toBe(true);
              expect(_.isNumber(employee.id)).toBe(true);
              expect(employee.name).toBe('John');
              expect(employee.changed).toEqual({});
            })
            .catch(() => done.fail('find failed'))
            .finally(done);
        });

        it('should allow to pass complex objects', (done) => {
          Employee.find(_.head(LocalStore.items))
            .then((employee) => {
              expect(employee instanceof Employee).toBe(true);
              expect(_.isNumber(employee.id)).toBe(true);
            })
            .catch(() => done.fail('find failed'))
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

      describe('where', () => {
        it('should fetch a list of models', (done) => {
            Employee.where({name: 'John Doe'})
              .then((Employees) => {
                expect(Employees.length).toBe(1);
                expect(Employees[0] instanceof Employee).toBe(true);
              })
              .finally(done);
        });
      });

      describe('default unimplemented methods', () => {
        _(['all', 'delete', 'find', 'where']).each((method) => {
          it('should have a method stub', () => {
            expect(() => (Model[method]())).toThrow();
          });
        });
      });
    });

    describe('methods', () => {
      let employee: Employee;
      beforeEach(() => {
        employee = new Employee();
      });

      describe('delete', () => {
        it('should delete the model', (done) => {
          let employee = new Employee(_.head(LocalStore.items));
          employee.delete()
            .then(() => {
              expect(_.includes(LocalStore.items, employee)).toBe(false);
            })
            .catch(() => done.fail('deletion failed'))
            .finally(done);
        });
      });

      describe('id', () => {
        it('should surface the ID', () => {
          employee.id = 123;
          expect(employee.id).toBe(123);
        });
      });

      describe('parse', () => {
        it('should parse dates', () => {
          employee.parse({
            id: 123,
            name: 'John Doe',
            birthdate: '2000-01-01T00:00:00.000Z'
          });
          expect(employee.id).toEqual(123);
          expect(employee.name).toEqual('John Doe');
          expect(employee.birthdate).toEqual(new Date('2000-01-01'));
        });
      });

      describe('save', () => {
        it('should reject if validations fail', (done) => {
          employee.save()
            .then(() => done.fail('save test failed'))
            .catch((errors) => {
              expect(errors.name).toEqual(['Name is required']);
            })
            .finally(done);
        });

        it('should allow to skip validation', () => {
          employee.id = 1;
          spyOn(employee, 'validate');
          employee.save({validate: false});
          expect(employee.store.update).toHaveBeenCalled();
          expect(employee.validate).not.toHaveBeenCalled();
        });

        it('should create if the model is new', (done) => {
          employee.name = 'valid name';
          employee.save()
            .then(() => {
              expect(_.isNumber(employee.id)).toBe(true);
              expect(_.omit(_.last(LocalStore.items), 'id')).toEqual({
                name: 'valid name',
                birthdate: undefined
              });
            })
            .catch(() => done.fail('creation failed'))
            .finally(done);
        });

        it('should update if the model is not new', () => {
          employee.id = 123;
          employee.name = 'valid name';
          employee.save();
          expect(employee.store.create).not.toHaveBeenCalled();
          expect(employee.store.update).toHaveBeenCalledWith(employee);
        });
      });

      describe('toJson', () => {
        it('should use serializers to format to JSON', () => {
          employee.birthdate = new Date('2000-01-01');
          employee.name = 'John Doe';
          expect(employee.toJson()).toEqual({
            id: undefined,
            birthdate: '2000-01-01T00:00:00.000Z',
            name: 'John Doe'
          });
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
      });
    });
  });
}
