describe('Dougal.Model', () => {
  beforeAll(() => {
    LocalStore.items = [{
      id: 1,
      name: 'Donald'
    }];
  });

  describe('static methods', () => {
    describe('all', () => {
      it('should get all models', (done) => {
        President.all()
          .then((presidents) => {
            expect(presidents.length).toBe(1);
            expect(presidents[0] instanceof President).toBe(true);
          })
          .finally(done);
      });
    });

    describe('extends', () => {
      // TODO
    });

    describe('find', () => {
      it('should find a model by ID', (done) => {
        President.find(1)
          .then((president) => {
            expect(president instanceof President).toBe(true);
            expect(president.id).toBe(1);
            expect(president.name).toBe('Donald');
            expect(president.changed).toEqual({});
          })
          .finally(done);
      });

      it('should throw an error if the record is not found', (done) => {
        President.find(999)
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
    let president: President;
    beforeEach(() => {
      president = new President();
    });

    describe('save', () => {
      xit('should reject if validations fail', (done) => {
        president.save()
          .catch((errors) => {
            expect(errors.name).toEqual(['feck']);
          })
          .finally(done);
      }).pend('need Q/angular.$q abstraction');

      it('should allow to skip validation', () => {
        spyOn(president.store, 'create').and.returnValue(Q.when());
        spyOn(president, 'validate');
        president.save({validate: false});
        expect(president.store.create).toHaveBeenCalled();
        expect(president.validate).not.toHaveBeenCalled();
      });
    });
  });
});
