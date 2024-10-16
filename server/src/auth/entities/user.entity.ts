import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  refreshToken?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
