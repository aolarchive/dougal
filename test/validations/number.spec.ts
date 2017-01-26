namespace Dougal.Tests {
  describe('Dougal.Validations.NumberValidator', () => {
    let options: IValidatorOptions = {number: true, message: 'error'};
    let number = new Validations.NumberValidator(options);

    function validate(value) {
      return number.validate(null, 'value', value);
    }

    it('should be defined', () => {
      expect(number).toBeDefined();
    });

    it('should restrict to numbers', () => {
      expect(validate('')).toBe(false);
    });

    it('should not allow values greater than', function () {
      options.number = {greaterThan: 10};
      expect(validate('11')).toBe(true);
      expect(validate('10')).toBe(false);
    });

    it('should not allow values greater than or equal to', function () {
      options.number = {greaterThanOrEqualTo: 10};
      expect(validate('11')).toBe(true);
      expect(validate('10')).toBe(true);
      expect(validate('9')).toBe(false);
    });

    it('should not allow values less than', function () {
      options.number = {lessThan: 10};
      expect(validate('9')).toBe(true);
      expect(validate('10')).toBe(false);
    });

    it('should not allow values greater than or equal to', function () {
      options.number = {lessThanOrEqualTo: 10};
      expect(validate('9')).toBe(true);
      expect(validate('10')).toBe(true);
      expect(validate('11')).toBe(false);
    });
  });
}