namespace Dougal {
  /**
   * Additional annotation for TypeScript inheritance.
   *
   * ```
   *  @ExtendedModel
   * class Employee extends Model {
   * }
   *
   * Employee.all(); // Available thanks to @ExtendedModel
   * ```
   * @param NewModel
   */
  export function ExtendedModel(NewModel) {
    NewModel.all = function (): Q.Promise<Model[]> {
      return Model._all(NewModel);
    };

    NewModel.delete = function (criteria: any): Q.Promise<any> {
      return Model._delete(criteria, NewModel);
    };

    NewModel.find = function (id): Q.Promise<Model> {
      return Model._find(id, NewModel);
    };

    NewModel.where = function (criteria: any): Q.Promise<Model[]> {
      return Model._where(criteria, NewModel);
    };

    Object.defineProperty(NewModel.prototype, 'id',
      Object.getOwnPropertyDescriptor(Model.prototype, 'id'));

    return NewModel;
  }
}
