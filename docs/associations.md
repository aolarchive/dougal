# Dougal Associations

## Available Associations

### `belongsTo`

The `belongsTo` association describes a one-to-one link between two models.

```javascript
const Employee = Dougal.Model.extends(function () {
  this.belongsTo('office', Office);
});
```

It will use the `officeId` attribute to fetch the matching parent model.

```javascript
new Employee({officeId: 123})
  .office
  .then((office) => console.log(`Office location: ${office.location}`));
```
