import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";

interface ContextRequest extends Session {
  userId?: any;
}

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {
    session?: ContextRequest;
    cookie?: any;
  };
  res: Response;
};
