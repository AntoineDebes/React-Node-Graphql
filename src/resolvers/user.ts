import { User } from "../entities/User";
import { MyContext } from "../Types";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field?: string;
  @Field()
  message?: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<User | Boolean> {
    if (!!(username && password !== "")) {
      const hashedPassword = await argon2.hash(password);
      const user = em.create(User, { username, password: hashedPassword });
      await em.persistAndFlush(user);
      return user;
    }
    return false;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (!!(username && password !== "")) {
      const user = em.findOne(User, { username: username.toLowerCase() });
      if (!user)
        ({
          errors: [
            { field: "username", message: "that username doesn't exist" },
          ],
        });
      const validation = argon2.verify(password, password);
      if (!validation)
        ({
          errors: [{ field: "password", message: "incorrect password" }],
        });
      return {
        user,
      };
    }
    return {
      errors: [
        { field: "username or password", message: "Please fill your data" },
      ],
    };
  }
}
