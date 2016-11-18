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
var President = Dougal.Model.extends(function () {
  this.baseUrl = '/presidents';

  this.attribute('id');
  this.attribute('name');

  this.validates('name', {presence: true, message: 'Name is required'});
});
```

Create a new record:
```javascript
var potus = new President({name: 'Donald Trump'});
```

Validate the record:
```javascript
potus.isValid(); // true
potus.name = '';
potus.isValid(); // false
potus.errors.name; // ['Name is required'];
```

Save the record:
```javascript
potus.save();
// POST /presidents {name: 'Donald Trump'}
```

### Angular.js integration

```html
<script src="node_modules/dougal/dougal-angular.js"></script>
```

```javascript
angular.module('your.app', ['dougal'])
  .factory('President', ['Dougal', function (Dougal) {
    function President() {
      // Model definition here
    }
    return Dougal.Model.extends(President);
  }])
  .controller('YourController', function (President) {
    this.president = new President();
  });
```
