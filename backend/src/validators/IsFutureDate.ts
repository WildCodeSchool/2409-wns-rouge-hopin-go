import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { isBefore, startOfDay } from "date-fns";

@ValidatorConstraint({ name: "isFutureDate", async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: Date) {
    return !isBefore(startOfDay(date), startOfDay(new Date()));
  }

  defaultMessage() {
    return "The departure date cannot be in the past.";
  }
}
