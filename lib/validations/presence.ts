namespace Dougal.Validations {
  export type IPresenceOptions = boolean;

  export class PresenceValidator extends Validator {
    validate(record: Model, attribute: string, value: any) {
      return !(this.options.presence && (_.isNil(value) || value === ''));
    }
  }
}
