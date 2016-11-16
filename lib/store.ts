namespace Dougal {
  @Extendable
  export class Serializer {
    format(record: Model): any {
      return record.attributes;
    }

    parse(object: any): any {
      return object;
    }
  }
  
  @Extendable
  export abstract class Store {
    abstract create(record: any): Q.Promise<any>
    abstract read(options?: any): Q.Promise<any>
    abstract update(record: any): Q.Promise<any>
    abstract delete(record: any): Q.Promise<any>
  }
}
