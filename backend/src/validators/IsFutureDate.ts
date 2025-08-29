import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { isBefore, startOfDay } from "date-fns";

@ValidatorConstraint({ name: "isFutureDate", async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    return !isBefore(startOfDay(date), startOfDay(new Date()));
  }

  defaultMessage(args: ValidationArguments) {
    return "The departure date cannot be in the past.";
  }
}
