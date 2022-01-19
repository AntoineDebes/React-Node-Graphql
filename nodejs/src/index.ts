import { MyContext } from "./Types";
import { PostResolver } from "./resolvers/post";
import "reflect-metadata";
import { HelloResolver } from "./resolvers/hello";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from "./constants";
import cookieParser from "cookie-parser";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  app.use(cookieParser());

  const corsOptions = {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  };
  app.set("trust proxy", process.env.NODE_ENV !== "production");
  // app.use((req: any, _, next) => {
  //   const refreshToken = req.cookies["refresh-token"];
  //   const accessToken = req.cookies["access-token"];
  //   if (!refreshToken && !accessToken) {
  //     return next();
  //   }

  //   try {
  //     const data = jwt.verify(
  //       accessToken,
  //       process.env.ACCESS_TOKEN_SECRET!
  //     ) as any;
  //     req.userId = data.userId;
  //     return next();
  //   } catch {}

  //   if (!refreshToken) {
  //     return next();
  //   }

  //   try {
  //     const data = jwt.verify(
  //       refreshToken,
  //       process.env.REFRESH_TOKEN_SECRET!
  //     ) as any;
  //     req.userId = data.userId;
  //     req.count = data.count;
  //   } catch {
  //     return next();
  //   }

  //   next();
  // });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      em: orm.em,
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: corsOptions });
  app.listen(4000, () => {
    console.log("Server is listening on port 4000");
  });
};
main().catch((err) => {
  console.error(err);
});
