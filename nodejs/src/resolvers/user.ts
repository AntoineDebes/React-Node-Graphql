import { createTokens } from "../middleware/jwtCreate";
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
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em, res }: MyContext
  ): Promise<User | Boolean> {
    if (!!(username && password !== "")) {
      const hashedPassword = await argon2.hash(password);

      const user = em.create(User, {
        username,
        password: hashedPassword,
        count: 0,
      });
      await em.persistAndFlush(user);
      const fetchedUser: any = await em.findOne(User, { username });
      const { accessToken, refreshToken } = createTokens(fetchedUser);

      fetchedUser.refreshToken = refreshToken;
      fetchedUser.accessToken = accessToken;
      await em.persistAndFlush(fetchedUser);
      res.cookie("access-token", accessToken, {
        signed: false,
        maxAge: 99999,
        httpOnly: false,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refresh-token", refreshToken, {
        signed: false,
        maxAge: 99999,
        httpOnly: false,
        secure: true,
        sameSite: "none",
      });
      return fetchedUser;
    }
    return false;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    console.log("passed");
    const { username, password } = options;
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

      return {
        user,
      };
    }
    return {
      errors: [{ field: "username", message: "Please fill your data" }],
    };
  }
}
