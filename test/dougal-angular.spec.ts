/// <reference types="angular-mocks" />

describe('dougal-angular', () => {
  var Dougal;

  beforeEach(module('dougal'));
  beforeEach(inject(($injector) => {
    Dougal = $injector.get('Dougal');
  }));

  it('should provide Dougal as a constant', inject(($q) => {
    expect(Dougal).toBe(window['Dougal']);
    expect(Dougal.Q).toBe($q);
  }));

  describe('$httpStore', () => {
    let president;
    let store;
    let $httpBackend;

    beforeEach(inject((_$httpBackend_, $httpStore) => {
      store = new $httpStore();
      $httpBackend = _$httpBackend_;

      president = new President();
      president.store = store;
    }));

    it('should be defined', () => {
      expect(store).toBeDefined();
    });

    it('should create a new record', () => {
      $httpBackend.expectPOST('/presidents', {
        name: 'Donald'
      }).respond({
        id: 1,
        name: 'Donald'
      });

      president.name = 'Donald';
      president.save();
      $httpBackend.flush();

      expect(president.id).toBe(1);
    });

    it('should read an existing record', function () {
      $httpBackend.expectGET('/presidents/1')
        .respond({
          id: 1,
          name: 'Donald'
        });

      president.id = 1;
      store.read(president)
        .then((response) => {
          expect(response).toEqual({
            id: 1,
            name: 'Donald'
          });
        });
      $httpBackend.flush();
    });

    it('should update an existing record', function () {
      $httpBackend.expectPOST('/presidents/1', {
        id: 1,
        name: 'Donald'
      }).respond({
        id: 1,
        name: 'Donald Trump'
      });

      president.id = 1;
      president.name = 'Donald';
      store.update(president)
        .then((response) => {
          expect(response).toEqual({
            id: 1,
            name: 'Donald Trump'
          });
        });
      $httpBackend.flush();
    });

    it('should delete an existing record', function () {
      $httpBackend.expectDELETE('/presidents/1', ).respond({});

      president.id = 1;
      president.name = 'Donald';
      store.delete(president)
        .then((response) => {
          expect(response).toEqual({});
        });
      $httpBackend.flush();
    });
  });

});
