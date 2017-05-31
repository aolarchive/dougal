const _           = require('lodash');
const express     = require('express');
const bodyParser  = require('body-parser');
const logger      = require('log4js').getLogger();
const path        = require('path');

const app = express();
const api = express.Router();
const port = 8080;

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

let employees = [];

api.route('/').get((req, res) => {
  res.send(_.orderBy(employees, ['updatedAt'], ['desc']));
});
api.route('/').post((req, res) => {
  let now = new Date().toISOString();
  let newEmployee = _.assign({
    id: _.uniqueId(),
    createdAt: now,
    updatedAt: now
  }, req.body);
  employees.push(newEmployee);
  res.send(JSON.stringify(newEmployee));
});
api.route('/:id').get((req, res) => {
  let employee = _.find(employees, ['id', req.params.id]);
  res.send(JSON.stringify(employee));
});
api.route('/:id').put((req, res) => {
  let employee = _.find(employees, ['id', req.params.id]);
  _.assign(employee, _.omit(req.body, ['id', 'createdAt', 'updatedAt']));
  employee.updatedAt = new Date().toISOString();
  res.send(JSON.stringify(employee));
});
api.route('/:id').delete((req, res) => {
  _.remove(employees, ['id', req.params.id]);
  res.send(true);
});

app.listen(port, () => {
  logger.debug(`Server running on port ${port}`);
});
