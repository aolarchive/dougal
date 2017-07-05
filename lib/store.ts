namespace Dougal {
  export interface Store {
    list(url: string, args?: any): Q.Promise<Array<Object>>
    create(record: Model): Q.Promise<any>
    read(record: Model): Q.Promise<Object>
    update(record: Model): Q.Promise<any>
    delete(record: Model): Q.Promise<any>
  }
}
