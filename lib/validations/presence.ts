namespace Dougal.Validations {
  export type IPresenceOptions = boolean;

  export class PresenceValidator extends Validator {
    validate(record: Model, attribute: string, value: any) {
      if (this.options.presence && (_.isNil(value) || value === '')) {
        record.errors.add(attribute, this.options.message);
      }
    }
  }
}
