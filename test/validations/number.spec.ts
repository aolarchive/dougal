namespace Dougal.Tests {
  describe('Dougal.Validations.NumberValidator', () => {
    let model: SampleModel;
    let options: IValidatorOptions = {number: true, message: 'error'};
    let number = new Validations.NumberValidator(options);

    class SampleModel extends Dougal.Model {
      value: string;

      constructor() {
        super();
        this.attribute('value');
        this.validates('value', number);
      }
    }

    function assertCorrect() {
      expect(model.errors.messages.value).toEqual([]);
    }

    function assertFaulty() {
      expect(model.errors.messages.value).toEqual(['error']);
    }

    beforeEach(() => {
      model = new SampleModel();
    });

    it('should be defined', () => {
      expect(number).toBeDefined();
    });

    it('should restrict to numbers', () => {
      model.value = '';
      assertFaulty();
    });

    it('should not allow values greater than', function () {
      options.number = {greaterThan: 10};
      model.value = '11';
      assertCorrect();
      model.value = '10';
      assertFaulty();
    });

    it('should not allow values greater than or equal to', function () {
      options.number = {greaterThanOrEqualTo: 10};
      model.value = '11';
      assertCorrect();
      model.value = '10';
      assertCorrect();
      model.value = '9';
      assertFaulty();
    });

    it('should not allow values less than', function () {
      options.number = {lessThan: 10};
      model.value = '9';
      assertCorrect();
      model.value = '10';
      assertFaulty();
    });

    it('should not allow values greater than or equal to', function () {
      options.number = {lessThanOrEqualTo: 10};
      model.value = '9';
      assertCorrect();
      model.value = '10';
      assertCorrect();
      model.value = '11';
      assertFaulty();
    });
  });
}