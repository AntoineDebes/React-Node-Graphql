import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { createTokens } from "./jwtCreate";

export const jwtValidation = async ({ req, res, em }: any) => {
  const refreshToken = req.cookies["refresh-token"];
  const accessToken = req.cookies["access-token"];
  if (!refreshToken && !accessToken) return null;
  try {
    const accessTokenData = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    );
    if (accessTokenData) {
      const user = await em.findOne(User, { id: accessTokenData.id });
      return user;
    }
  } catch {}

  if (!refreshToken) return null;

  const refreshTokenData = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  );

  if (!refreshTokenData) return null;

  const user = await em.findOne(User, { id: refreshTokenData.id });

  if (!user || user.count !== refreshTokenData.count) return null;
  user.count += 1;
  const tokens = createTokens(user);
  user.accessToken = tokens.accessToken;
  user.refreshToken = tokens.refreshToken;

  await em.persistAndFlush(user);
  res.cookie("refresh-token", tokens.refreshToken);
  res.cookie("access-token", tokens.accessToken);
  return user;
};
