namespace Dougal.Tests {
  describe('Dougal.Validations.LengthValidator', () => {
    let model: SampleModel;
    let options: any = {length: {}, message: 'error'};
    let length = new Validations.LengthValidator(options);

    class SampleModel extends Dougal.Model {
      value: string;

      constructor() {
        super();
        this.attribute('value');
        this.validates('value', length);
      }
    }

    beforeEach(() => {
      model = new SampleModel();
    });

    it('should be defined', () => {
      expect(length).toBeDefined();
    });

    it('should only allow a fixed string length', () => {
      options.length.is = 2;
      model.value = '';
      expect(model.errors.messages.value).toEqual(['error']);
      
      model.value = 'te';
      expect(model.errors.messages.value).toEqual([]);
      
      model.value = 'test';
      expect(model.errors.messages.value).toEqual(['error']);
    });
  });
}
