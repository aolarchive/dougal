describe('Dougal.Validations.LengthValidator', () => {
  type LengthValidator = Dougal.Validations.LengthValidator;
  const LengthValidator = Dougal.Validations.LengthValidator;

  let model: SampleModel;
  let options: any = {length: {}, message: 'error'};
  let length = new LengthValidator(options);

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
    expect(model.errors.value).toEqual(['error']);
    
    model.value = 'te';
    expect(model.errors.value).toEqual([]);
    
    model.value = 'test';
    expect(model.errors.value).toEqual(['error']);
  });
});
