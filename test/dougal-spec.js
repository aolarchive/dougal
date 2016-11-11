describe('dougal', function () {

  var President, BirthDateValidator;

  beforeEach(function () {
    BirthDateValidator = Dougal.AttributeValidator.extends(function (president, attribute, value) {
      if (value && new Date().getTime() > value.getTime()) {
        president.errors.add(attribute, this.options.message);
      }
    });

    function PresidentModel() {
      this.attribute('name', {
        set: function (name) {
          this.attributes.name = (name || '').trim();
        }
      });

      this.attribute('birthdate');
      this.validates('birthdate', BirthDateValidator, {message: 'No babies allowed'});

      this.isPresident = function () {
        return this.name.toLowerCase() === 'donald';
      };
    }

    President = Dougal.Model.extends(PresidentModel);
  });

  it('should', function () {
    expect(President).toBeDefined();
    var donald = new President();
    expect(donald instanceof Dougal.Model).toBe(true);
    donald.name = ' hillary ';
    expect(donald.name).toEqual('hillary');
    expect(donald.isPresident()).toBe(false);
    donald.name = 'donald ';
    expect(donald.isPresident()).toBe(true);

    donald.birthdate = new Date(1478861388765);
    expect(donald.errors.birthdate).toEqual(['No babies allowed']);
    expect(donald.valid).toBe(false);

    donald.birthdate = new Date(new Date().getTime() + 1000);
    expect(donald.errors.birthdate).toBeUndefined();
    expect(donald.valid).toBe(true);

  });
});
