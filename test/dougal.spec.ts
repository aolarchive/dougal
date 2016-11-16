describe('dougal', function () {
  it('should', function (done) {
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
    expect(donald.errors.birthdate).toEqual([]);
    expect(donald.valid).toBe(true);

    donald.save()
      .then(() => {
        expect(JSON.parse(localStorage.getItem('/presidents/1')))
          .toEqual(donald.attributes);
        expect(donald.id).toEqual('1');
      })
      .finally(done);
  });
});
