# Dougal Querying

## Fetching a single model

```javascript
Employee.find(123).then((employee) => { /* */ });
// or
new Employee({id: 123}).fetch();
```

## Fetching a list of models

```javascript
Employee.all().then((employees) => { /* */ });
// or
Employee.where({some: 'filter'}).then((employees) => { /* */ });
```
