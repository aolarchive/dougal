namespace Dougal {
  describe('Dougal.decorators.extendable', () => {
    @Extendable
    class SomeClass {
      someProp: 'some value'
    }

    let ExtendedClass;

    beforeEach(() => {
      ExtendedClass = SomeClass.extends(function () {
        this.additionalProperty = 'some new value';
      });
    });

    it('should allow to extend the class', () => {
      expect(SomeClass.extends).toBeDefined();
      expect(ExtendedClass).toBeDefined();
    });

    it('should allow to instantiate a new extended class', () => {
      let instance = new ExtendedClass();
      expect(instance).toBeDefined();
      expect(instance instanceof SomeClass).toBe(true);
    });
  });
}
