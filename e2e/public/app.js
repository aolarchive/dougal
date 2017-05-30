(function () {
  'use strict';

  angular.module('dougal.e2e', ['dougal', 'ngRoute'])
    .config(setupRoutes)
    .factory('Employee', employeeFactory)
    .controller('EmployeeController', EmployeeController)
    .controller('ListController', ListController)
    .component('employeeList', {
      templateUrl: 'list.html',
      controller: 'ListController',
      controllerAs: '$ctrl'
    })
    .component('employeeDetails', {
      templateUrl: 'form.html',
      controller: 'EmployeeController',
      controllerAs: '$ctrl'
    });

  function setupRoutes($routeProvider) {
    $routeProvider.when('/', {
      template: '<employee-list></employee-list>'
    });
    $routeProvider.when('/create', {
      template: '<employee-details></employee-details>'
    });
    $routeProvider.when('/:id', {
      template: '<employee-details></employee-details>'
    });
  }

  function employeeFactory(Dougal) {
    function Employee() {
      this.urlRoot = '/api/employees';

      this.attribute('id');
      this.attribute('name');
      this.attribute('createdAt', 'date');
      this.attribute('updatedAt', 'date');

      this.validates('name', {presence: true, message: 'Name is required'});
    }

    return Dougal.Model.extends(Employee);
  }

  function ListController(Employee) {

    this.delete = function (employee) {
      employee.delete()
        .then(() => this.load());
    };

    this.load = function () {
      Employee.all()
        .then(employees => {
          this.employees = employees
        });
    };

    this.load();
  }

  function EmployeeController($routeParams, Employee) {
    if ($routeParams.id) {
      Employee.find($routeParams.id)
        .then(employee => this.employee = employee);
    } else {
      this.employee = new Employee();
    }

    this.save = () => {
      this.employee.save();
    };
  }

})();
