namespace Dougal.Validations {
  export class PresenceValidator extends Validator {
    validate(record: any, attribute: string, value: any) {
      if (this.options.presence && _.isEmpty(value)) {
        record.errors.add(attribute, this.options.message);
      }
    }
  }
}
