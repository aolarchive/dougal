namespace Dougal.Tests {
  export class LocalStore implements Store {
    static items = [];

    list() {
      return q.when(LocalStore.items);
    }

    create(record): Q.Promise<any> {
      record.id = _.uniqueId();
      let object = record.serializer.format();
      LocalStore.items.push(object);
      return this.read(record);
    }

    read(record: Model): Q.Promise<any> {
      return q.when(_.find(LocalStore.items, [record.idAttribute, record.id]));
    }

    update(record): Q.Promise<any> {
      let object = record.serializer.format();
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