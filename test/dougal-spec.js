describe('dougal', function () {

  var President, BirthDateValidator;

  beforeEach(function () {
    BirthDateValidator = Dougal.Validator.extends(function () {
      this.validate = function (president, attribute, value) {
        if (value < new Date()) {
          president.errors.add(attribute, this.options.message);
        }
      };
    });

    President = Dougal.Model.extends(function () {
      this.attribute('name', {
        set: function (name) {
          this.attributes.name = (name || '').trim();
        }
      });
      this.validates('name', {
        presence: true,
        length: {minimum: 2},
        message: 'Name is required'
      });
      this.validates('name', 'validatePresidentName');

      this.attribute('birthdate');
      this.validates('birthdate', new BirthDateValidator({message: 'No babies allowed'}));


      this.isPresident = function () {
        return _.lowerCase(this.name) === 'donald';
      };

      this.validatePresidentName = function () {
        if (!this.isPresident()) {
          this.errors.add('name', 'Donald is the president!');
        }
      };
    });
  });

  it('should', function () {
    expect(President).toBeDefined();
    var donald = new President();
    expect(donald instanceof Dougal.Model).toBe(true);
    expect(donald.valid).toBe(false);
    expect(donald.errors.name).toEqual(['Name is required', 'Donald is the president!']);
    donald.name = ' hillary ';
    expect(donald.name).toEqual('hillary');
    expect(donald.valid).toBe(false);
    expect(donald.errors.name).toEqual(['Donald is the president!']);
    expect(donald.isPresident()).toBe(false);
    donald.name = 'donald ';
    expect(donald.isPresident()).toBe(true);
    expect(donald.errors.name).toEqual([]);

    donald.birthdate = new Date(new Date().getTime() - 1000);
    expect(donald.errors.birthdate).toEqual(['No babies allowed']);
    expect(donald.valid).toBe(false);

    donald.birthdate = new Date(new Date().getTime() + 1000);
    expect(donald.errors.birthdate).toBeUndefined();
    expect(donald.valid).toBe(true);
  });
});
