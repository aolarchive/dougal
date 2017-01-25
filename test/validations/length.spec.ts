namespace Dougal.Tests {
  describe('Dougal.Validations.LengthValidator', () => {
    let options: IValidatorOptions = {length: {}, message: 'error'};
    let length = new Validations.LengthValidator(options);

    it('should be defined', () => {
      expect(length).toBeDefined();
    });

    function validate(value) {
      return length.validate(null, 'value', value);
    }

    it('should only allow a fixed string length', () => {
      options.length.is = 2;
      expect(validate('')).toBe(false);
      expect(validate('te')).toBe(true);
      expect(validate('test')).toBe(false);
    });
  });
}
