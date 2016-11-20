describe('Dougal.Model', () => {
  beforeAll(() => {
    LocalStore.items = [];
  });

  describe('all', () => {
    it('should get all models', (done) => {
      new President({name: 'Donald'}).save();
      President.all().then((presidents) => {
        expect(presidents.length).toBe(1);
        expect(presidents[0] instanceof President).toBe(true);
      }).finally(done);
    });
  });
});
