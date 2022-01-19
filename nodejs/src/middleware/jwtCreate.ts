import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { config } from "dotenv";
config();

export const createTokens = (user: User) => {
  console.log("user", user);

  const refreshToken = jwt.sign(
    { id: user.id, count: user.count },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );

  return { refreshToken, accessToken };
};
