# Dougal

[![Build Status](https://img.shields.io/travis/aol/dougal.svg?style=flat-square)](https://travis-ci.org/aol/dougal)
[![Coverage Status](https://img.shields.io/coveralls/aol/dougal.svg?style=flat-square)](https://coveralls.io/github/aol/dougal)
![npm](https://img.shields.io/npm/v/dougal.svg?style=flat-square)
![Bower](https://img.shields.io/bower/v/dougal.svg?style=flat-square)

The M of MVC, for Javascript VC frameworks that lack a decent M.

## Getting Started

Install Dougal:

```
$ npm install aol/dougal
```
```html
<script src="node_modules/dougal/dougal.js"></script>
```

Define models:

```javascript
var Employee = Dougal.Model.extends(function () {
  this.urlRoot = '/employees';

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
