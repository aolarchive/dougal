namespace Dougal.Tests {
  export class LocalStore implements Store {
    static items = [];

    constructor() {
      spyOn(this, 'list').and.callThrough();
      spyOn(this, 'create').and.callThrough();
      spyOn(this, 'read').and.callThrough();
      spyOn(this, 'update').and.callThrough();
      spyOn(this, 'delete').and.callThrough();
    }

    list() {
      return q.when(LocalStore.items);
    }

    create(record): Q.Promise<any> {
      record.id = _.uniqueId();
      let object = record.toJson();
      LocalStore.items.push(object);
      return this.read(record);
    }

    read(record: Model): Q.Promise<any> {
      return q.when(_.find(LocalStore.items, [record.idAttribute, record.id]));
    }

    update(record): Q.Promise<any> {
      let object = record.toJson();
      let index = _.findIndex(LocalStore.items, [record.idAttribute, record.id]);
      LocalStore.items.splice(index, 1, object);
      return q.when(object);
    }

    delete(record): Q.Promise<any> {
      _.remove(LocalStore.items, [record.idAttribute, record.id]);
      return q.when({});
    }
  }
}
