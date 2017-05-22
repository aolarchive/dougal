# Getting Started

## Install Dougal

Dougal is available through both Bower and npm, to your convenience:

```
$ npm install dougal --save
# or
$ bower install dougal --save
```

You only need to include a single file in your index.html:
```html
<script src="bower_components/dougal/dougal.js"></script>
```

### Angular integration

Include this additional file:
```html
<script src="bower_components/dougal/dougal-angular.js"></script>
```

It will automatically integrate Dougal with Angular's $q promise library, as well as

### Promises

If you do not use Angular, you will need to include Kriskowal's Q promise library.
