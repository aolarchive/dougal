namespace Dougal {
  @Extendable
  export class Serializer {
    constructor(private record: Model) {
    }

    format(): any {
      return _.cloneDeep(this.record.attributes);
    }

    parse(object: any): any {
      return object;
    }
  }

  export interface Store {
    list(url: string, args?: any): Q.Promise<Array<any>>
    create(record: Model): Q.Promise<any>
    read(record: Model): Q.Promise<any>
    update(record: Model): Q.Promise<any>
    delete(record: Model): Q.Promise<any>
  }
}
