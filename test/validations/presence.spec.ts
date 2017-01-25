namespace Dougal.Tests {
  describe('Dougal.Validations.PresenceValidator', () => {
    let options: IValidatorOptions = {presence: true, message: 'error'};
    let presence = new Validations.PresenceValidator(options);

    it('should be defined', () => {
      expect(presence).toBeDefined();
    });

    function validate(value) {
      return presence.validate(null, 'value', value);
    }

    it('should not allow empty values', () => {
      expect(validate(undefined)).toBe(false);
      expect(validate(null)).toBe(false);
      expect(validate('')).toBe(false);
      expect(validate('test')).toBe(true);
    });
  });
}
