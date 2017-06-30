namespace Dougal {
  export namespace Serialization {

    export interface ISerializer {
      format(value);
      parse(value);
    }

    const availableSerializers = {};

    export function get(name: string): ISerializer {
      return availableSerializers[_.toLower(name)];
    }

    export function register(name: string, serializer: ISerializer) {
      availableSerializers[_.toLower(name)] = serializer;
    }

    export function resolve(serializer: Serializer): ISerializer {
      return (_.isString(serializer) ? get(serializer) : serializer)
        || {
          format: _.identity,
          parse: _.identity
        };
    }

    const DateSerializer: ISerializer = {
      format(value: Date|any) {
        return _.isDate(value)
          ? value.toISOString()
          : value;
      },

      parse(value: any): Date {
        return new Date(value);
      }
    };

    register('date', DateSerializer);

    const NumberSerializer: ISerializer = {
      format: _.identity,

      parse(value: any): Number {
        return parseFloat(value);
      }
    };

    register('number', NumberSerializer);
  }

  export type Serializer = string | Serialization.ISerializer;
}
