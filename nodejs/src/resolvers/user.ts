import emailValidation from "./../utils/emailValidation";
import { jwtCreate } from "../middleware/jwtCreate";
import { User } from "../entities/User";
import { MyContext } from "../Types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { config } from "dotenv";
import { UsernamePasswordInput } from "../types/usrPassInp";
import { jwtValidation } from "../middleware/jwtValidation";
config();
@ObjectType()
class FieldError {
  @Field()
  field?: "username" | "password";
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
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string
    // @Ctx() { em, req }: MyContext
  ) {
    // const user = await em.findOne(User,{email})
    return true;
  }

  @Query(() => User)
  async me(@Ctx() { req, res, em }: MyContext) {
    const user = await jwtValidation({ req, res, em });
    if (user) {
      console.log("user", user);

      return user;
    } else {
      return {
        errors: [{ field: "token", message: "Token didn't refresh" }],
      };
    }
  }

  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, res }: MyContext
  ): Promise<User | Boolean | {}> {
    const { username, email, password } = options;
    if (!!(username && email && password)) {
      email.toLowerCase();
      username.toLowerCase();

      const emailValidationResponse = await emailValidation(email);
      if (!!emailValidationResponse) return emailValidationResponse;

      const hashedPassword = await argon2.hash(password);

      const user = em.create(User, {
        username,
        password: hashedPassword,
        email,
        count: 0,
      });

      await em.persistAndFlush(user);
      const fetchedUser: any = await em.findOne(User, { email });
      await jwtCreate({
        user: fetchedUser,
        res,
      });
      await em.persistAndFlush(fetchedUser);
      return fetchedUser;
    }
    return false;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, res }: MyContext
  ): Promise<UserResponse> {
    const { username, email, password } = options;
    if (!!((username || email) && password)) {
      let user;
      if (email) {
        user = await em.findOne(User, {
          email: email,
        });
      } else if (username) {
        user = await em.findOne(User, {
          username: username.toLowerCase(),
        });
      }
      console.log("user: ", user);

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
      await jwtCreate({ user, res });
      return {
        user,
      };
    }
    return {
      errors: [{ field: "username", message: "Please fill your data" }],
    };
  }
}
