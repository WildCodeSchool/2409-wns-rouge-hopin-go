import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isFutureDateAndTime", async: false })
export class IsFutureDateAndTime implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    return date.getTime() > Date.now();
  }

  defaultMessage(args: ValidationArguments) {
    return "The departure date and time must be greater than the current date and time.";
  }
}
