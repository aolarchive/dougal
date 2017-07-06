namespace Dougal.Tests {
  describe('Dougal.Validations.ValidatorResolver', () => {
    const ValidatorResolver = Validations.ValidatorResolver;

    it('should parse a pair of strings', () => {
      let resolver = new ValidatorResolver(['name', 'customValidator']);
      let employee = new Employee({name: 'test'});

      employee.customValidator = _.constant(true);
      expect(resolver.run(employee)).toBe(true);

      employee.customValidator = _.constant(false);
      expect(resolver.run(employee)).toBe(false);
    });

    it('should parse resolver objects', () => {
      let resolver = new ValidatorResolver(['name', {presence: true, length: {minimum: 3}}]);
      let employee = new Employee();

      expect(resolver.run(employee)).toBe(false);

      employee.name = 'something';
      expect(resolver.run(employee)).toBe(true);
    });

    it('should parse resolver functions', () => {
      let validator = jasmine.createSpy('validator').and.returnValue(true);
      let Extended = Validator.simple(validator);
      let resolver = new ValidatorResolver(['name', new Extended({})]);
      let employee = new Employee({name: 'Bob'});

      resolver.run(employee);
      expect(validator).toHaveBeenCalledWith(employee, 'name', 'Bob');
    });

    it('should throw errors if the format is invalid', () => {
      expect(() => new ValidatorResolver([])).toThrow('unrecognized validation format');
      expect(() => new ValidatorResolver(['name', null])).toThrow('unrecognized validation format');
    });
  });
}
