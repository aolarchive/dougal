const _           = require('lodash');
const express     = require('express');
const bodyParser  = require('body-parser');
const logger      = require('log4js').getLogger();
const path        = require('path');

const app = express();
const api = express.Router();
const port = 8080;

class EmployeesController {
  constructor() {
    this.employees = [];
    _.each([
      {name: 'John Doe', gender: 'M'},
      {name: 'Jane Doe', gender: 'F'}
    ], (data) => this.create(data));
  }

  list(query) {
    return _(this.employees)
      .filter((employee) => {
        if (query.gender && employee.gender !== query.gender) {
          return false;
        }
        return true;
      })
      .orderBy(['updatedAt'], ['desc'])
      .value();
  }

  show(id) {
    return this.find(id);
  }

  create(data) {
    let now = new Date().toISOString();
    let newEmployee = _.assign({
      id: _.uniqueId(),
      createdAt: now,
      updatedAt: now
    }, data);
    this.employees.push(newEmployee);
    return newEmployee;
  }

  update(id, data) {
    let employee = this.find(id);
    _.assign(employee, _.omit(data, ['id', 'createdAt', 'updatedAt']));
    employee.updatedAt = new Date().toISOString();
  }

  delete(id) {
    _.remove(this.employees, ['id', req.params.id]);
    return true;
  }

  find(id) {
    return _.find(this.employees, ['id', id]);
  }
}

app.use(bodyParser.json());

const staticFiles = [
  ['/', 'e2e/index.html'],
  ['/dougal.js', 'dougal.js'],
  ['/dougal-angular.js', 'dougal-angular.js']
];

staticFiles.forEach(pair => {
  app.get(pair[0], (req, res) => {
    res.sendFile(pair[1], {root: path.join(__dirname, '..')});
  });
});

app.use(express.static('e2e/public'));
app.use(express.static('node_modules'));

app.use('/api/employees', api);

let controller = new EmployeesController();

api.route('/').get((req, res) => {
  res.send(JSON.stringify(controller.list(req.query)));
});
api.route('/').post((req, res) => {
  res.send(JSON.stringify(controller.create(req.body)));
});
api.route('/:id').get((req, res) => {
  res.send(JSON.stringify(controller.show(req.params.id)));
});
api.route('/:id').put((req, res) => {
  res.send(JSON.stringify(controller.update(req.params.id, req.body)));
});
api.route('/:id').delete((req, res) => {
  res.send(JSON.stringify(controller.delete(req.params.id)));
});

app.listen(port, () => {
  logger.debug(`Server running on port ${port}`);
});
