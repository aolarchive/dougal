# Dougal Serialization

## Example

```javascript
var Employee = Dougal.Model.extends(function () {
  this.attribute('hiringDate', 'date');
});
var john = new Employee().parse({hiringDate: '2010-01-01T00:00:00.000Z'});
john.hiringDate; // Fri Jan 01 2010 (Date object)
json.toJson(); // {hiringDate: '2010-01-01T00:00:00.000Z'}
```

Serialization describes how to parse/format for a given attribute.

## Built in serializations

* String (default)
* Numbers
* Date (vanilla Javascript objects)

## Custom serialization

Example for moment.js serializer:

```javascript
Dougal.Serialization.register('moment', {
  format: function (date) {
    return date ? date.toISOString() : '';
  },
  parse: function (date) {
    return moment(date);
  }
});
```
