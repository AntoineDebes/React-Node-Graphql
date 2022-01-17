import { User } from "../entities/User";
import { MyContext } from "../Types";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
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
  user?: User | any;
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
      const userJwt = jwt.sign({ username }, "password", {
        noTimestamp: true,
        expiresIn: "1y",
      });
      const user = em.create(User, {
        username,
        password: hashedPassword,
        userJwt,
      });
      await em.persistAndFlush(user);
      return user;
    }
    return false;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (!!(username && password !== "")) {
      const user = await em.findOne(User, { username: username.toLowerCase() });
      if (!user) {
        return {
          errors: [
            { field: "username", message: "that username doesn't exist" },
          ],
        };
      }
      const validation = await argon2.verify(user.password, password);
      if (!validation) {
        return {
          errors: [{ field: "password", message: "incorrect password" }],
        };
      }
      req.session.userId = user.id;

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
