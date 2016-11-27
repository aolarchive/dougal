/// <reference types="angular-mocks" />

namespace Dougal.Tests.Angular {
  describe('dougal-angular', () => {
    var Dougal;

    beforeEach(module('dougal'));
    beforeEach(inject(($injector) => {
      Dougal = $injector.get('Dougal');
    }));

    it('should provide Dougal as a constant', inject(($q) => {
      expect(Dougal).toBe(window['Dougal']);
      expect(Dougal.q).toBe($q);
    }));

    describe('$httpStore', () => {
      let employee;
      let store;
      let $httpBackend;

      beforeEach(inject((_$httpBackend_, $httpStore) => {
        store = new $httpStore();
        $httpBackend = _$httpBackend_;

        employee = new Employee();
        employee.store = store;
      }));

      it('should be defined', () => {
        expect(store).toBeDefined();
      });

      it('should create a new record', () => {
        $httpBackend.expectPOST('/employees', {
          name: 'John'
        }).respond({
          id: 1,
          name: 'John'
        });

        employee.name = 'John';
        employee.save();
        $httpBackend.flush();

        expect(employee.id).toBe(1);
      });

      it('should read an existing record', function () {
        $httpBackend.expectGET('/employees/1')
          .respond({
            id: 1,
            name: 'John'
          });

        employee.id = 1;
        store.read(employee)
          .then((response) => {
            expect(response).toEqual({
              id: 1,
              name: 'John'
            });
          });
        $httpBackend.flush();
      });

      it('should update an existing record', function () {
        $httpBackend.expectPUT('/employees/1', {
          id: 1,
          name: 'John'
        }).respond({
          id: 1,
          name: 'John Doe'
        });

        employee.id = 1;
        employee.name = 'John';
        store.update(employee)
          .then((response) => {
            expect(response).toEqual({
              id: 1,
              name: 'John Doe'
            });
          });
        $httpBackend.flush();
      });

      it('should delete an existing record', function () {
        $httpBackend.expectDELETE('/employees/1', ).respond({});

        employee.id = 1;
        employee.name = 'John';
        store.delete(employee)
          .then((response) => {
            expect(response).toEqual({});
          });
        $httpBackend.flush();
      });
    });

  });
}