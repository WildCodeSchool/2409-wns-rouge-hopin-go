import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isFutureDate", async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    return date.getTime() > Date.now();
  }

  defaultMessage(args: ValidationArguments) {
    return "The departure date and time must be greater than the current date and time.";
  }
}
