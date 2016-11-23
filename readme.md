# Dougal

[![Build Status](https://travis-ci.org/manudwarf/dougal.svg?branch=master)](https://travis-ci.org/manudwarf/dougal)

The M of MVC, for Javascript VC frameworks that lack a decent M.

## Getting Started

Install Dougal:

```
$ npm install manudwarf/dougal
```
```html
<script src="node_modules/dougal/dougal.js"></script>
```

Define models:

```javascript
var Employee = Dougal.Model.extends(function () {
  this.baseUrl = '/employees';

  this.attribute('id');
  this.attribute('name');

  this.validates('name', {presence: true, message: 'Name is required'});
});
```

Create a new record:

```javascript
var newHire = new Employee({name: 'John Doe'});
```

Validate the record:

```javascript
newHire.isValid(); // true
newHire.name = '';
newHire.isValid(); // false
newHire.errors.name; // ['Name is required'];
```

Save the record:

```javascript
newHire.save();
// POST /employees {name: 'John Doe'}
```

### Angular.js integration

```html
<script src="node_modules/dougal/dougal-angular.js"></script>
```

```javascript
angular.module('your.app', ['dougal'])
  .factory('Employee', ['Dougal', function (Dougal) {
    function Employee() {
      // Model definition here
    }
    return Dougal.Model.extends(Employee);
  }])
  .controller('YourController', function (Employee) {
    this.employee = new Employee();
  });
```
