import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class VerifyEmailResponse {
  @Field()
  success!: boolean;

  @Field()
  message!: string;
}
